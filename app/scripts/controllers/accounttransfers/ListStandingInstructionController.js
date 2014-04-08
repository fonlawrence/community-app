(function (module) {
    mifosX.controllers = _.extend(module, {
        ListStandingInstructionController: function (scope, resourceFactory, paginatorService,routeParams, dateFilter, location) {
            scope.restrictDate = new Date();
            var params = {officeId:routeParams.officeId,clientId: routeParams.clientId};
            if(routeParams.clientId){
                scope.formData = {fromOfficeId: Number(params.officeId), fromClientId: Number(params.clientId),fromAccountType:2};
                scope.fromClient = true;
            }else{ 
                scope.formData = {fromAccountType:2};
                scope.fromClient = false;
            }
            resourceFactory.standingInstructionTemplateResource.get(scope.formData, function (data) {
                scope.standinginstruction = data;
                if(data.fromClient){
                    scope.formData.clientName = data.fromClient.displayName;
                    scope.searchTransaction();
                }
            });

            var fetchFunction = function (offset, limit, callback) {
                var params = {};
                params.offset = offset;
                params.limit = limit;
                params.locale = "en";
                params.dateFormat = "dd MMMM yyyy";

                if (scope.formData.transferType) {
                    params.transferType = scope.formData.transferType;
                }

                if (scope.formData.clientName) {
                    params.clientName = scope.formData.clientName;
                }

                if (scope.formData.fromClientId) {
                    params.clientId = scope.formData.fromClientId;
                }

               
                if (scope.formData.fromAccountId) {
                    params.fromAccountId = scope.formData.fromAccountId;
                    params.fromAccountType = scope.formData.fromAccountType;
                }

                        

                resourceFactory.standingInstructionResource.search(params, callback);
            };

             scope.searchTransaction = function () {
                scope.displayResults = true;
                scope.instructions = paginatorService.paginate(fetchFunction, 14);
                scope.isCollapsed = false;
            };

            scope.deletestandinginstruction = function(id){
                resourceFactory.standingInstructionResource.cancel({standingInstructionId: id}, function (data) {
                    scope.searchTransaction();
                });
            }
        }
    });
    mifosX.ng.application.controller('ListStandingInstructionController', ['$scope', 'ResourceFactory', 'PaginatorService', '$routeParams','dateFilter', '$location', mifosX.controllers.ListStandingInstructionController]).run(function ($log) {
        $log.info("ListStandingInstructionController initialized");
    });
}(mifosX.controllers || {}));
