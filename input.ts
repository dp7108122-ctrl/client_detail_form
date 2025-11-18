var app = angular.module('ProjectInquiryApp', []);

app.controller('InquiryController', ['$scope', function($scope) {
    
    // Initial data structure for two-way binding (ng-model)
    $scope.initialFormData = {
        contact_name: '',
        email: '',
        phone: '',
        company_name: '',
        services_required: [], // Must be an array for multiple select
        budget_min: null,
        details_objective: '',
        urgent_priority: false, 
        terms_agreed: false
    };
    
    // Initialize the main model for the form
    $scope.formData = angular.copy($scope.initialFormData); // This initializes the data
    
    // Variable to hold the successfully submitted data
    $scope.submittedData = {};
    // Flag to control the visibility of the submitted data display area
    $scope.submissionSuccess = false;

    // --- Helper function to reset the form model and validation state ---
    $scope.resetForm = function() {
        // Reset model to initial blank state
        $scope.formData = angular.copy($scope.initialFormData);
        
        // Reset the form's validation state (ng-pristine, ng-untouched)
        if ($scope.inquiryForm) {
            $scope.inquiryForm.$setPristine();
            $scope.inquiryForm.$setUntouched();
        }
    };
    
    // --- Submission Function ---
    $scope.submitInquiry = function(isValid) {
        if (isValid) {
            // 1. Store the form data
            $scope.submittedData = angular.copy($scope.formData);
            
            // 2. Display the data area
            $scope.submissionSuccess = true;
            
            // 3. Reset the form fields for a new entry
            $scope.resetForm();

        } else {
            alert('Please fill out all required fields correctly, including agreeing to the Terms.');
            // This line ensures AngularJS updates the visual state of the form 
            // to show validation errors when the user tries to submit an invalid form.
            $scope.inquiryForm.$setSubmitted(); 
        }
    };
    
    // --- Clear Form/Data Function ---
    $scope.clearSubmission = function() {
        // Clear the form fields and validation state
        $scope.resetForm();
        
        // Hide the submitted data display
        $scope.submissionSuccess = false;
        $scope.submittedData = {};
    };

    // REMOVED: Initial call to $scope.resetForm(); as initialization is handled above.
    // The form is ready to use immediately.
}]);
