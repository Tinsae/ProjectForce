({
    doInit: function (component, event, helper) {
        var action = component.get("c.getBacklogs");
        // Add callback behavior for when response is received
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue())
                component.set("v.backlogs", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        // Send action off to be executed
        $A.enqueueAction(action);
    },

    droppedHandler: function (component, event, helper) {
        var title = event.getParam('title');
        var backlog = event.getParam('backlog');
        var listOfBacklogs = component.get('v.backlogs');


        var theBacklog = listOfBacklogs.find(function (el) {
            return el.Story__c == backlog.Story__c;
        });
        if (theBacklog) {
            theBacklog.Stage__c = title;
            component.set('v.backlogs', listOfBacklogs);

            // update database
            var action = component.get("c.saveBacklog");
            action.setParams({
                "backlog": theBacklog
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('updated');
                }
            });
            $A.enqueueAction(action);
        } else {
            console.log('Could not find this', backlog);
        }
    }
})