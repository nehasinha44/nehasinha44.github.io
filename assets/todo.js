
var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function(todo, data, $) {

    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        // Adding drop function to each category of task
        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];

                            // Removing old element
                            removeElement(object);

                            // Changing object code
                            object.code = index;

                            // Generating new element
                            generateElement(object);
                            //count find
                            countFind();
                            // Updating Local Storage
                            data[id] = object;
                            localStorage.setItem("todoData", JSON.stringify(data));

                            // Hiding Delete Area
                            $("#" + defaults.deleteDiv).hide();
                    }
            });
        });
        
        // Adding drop function to delete div
        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                // Removing old element
                removeElement(object);
                // Updating local storage
                delete data[id];
                localStorage.setItem("todoData", JSON.stringify(data));
                // Hiding Delete Area
                $("#" + defaults.deleteDiv).hide();
            }
        })
        //count find
        countFind();
    };

    // Add Task wrapper
    var generateElement = function(params){
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class" : defaults.todoTask,
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);

        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);


	    wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
                
            },
	        revert: "invalid",
	        revertDuration : 200
        });


    };

    // Remove task wrapper
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
        countFind();
        
    };

    var countFind = function (params) {
        var pendingcount=$("#pending div[class*='todo-task']").length;
        var inProgresscount=$("#inProgress div[class*='todo-task']").length;
        var completedcount=$("#completed div[class*='todo-task']").length;
        var totalcountupdate = parseInt(pendingcount)+parseInt(inProgresscount)+parseInt(completedcount);
        $( "#Pendingcount" ).html( "<span> "+pendingcount+"<span>");
        $( "#inProgresscount" ).html( "<span> "+inProgresscount+"<span>");
        $( "#completedcount" ).html( "<span> "+completedcount+"<span>");
        $( "#totalcount" ).html( "<span>Total : "+totalcountupdate+"<span>");
        
    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, tempData;

        if (inputs.length !== 1) {
            return;
        }

        title = inputs[0].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);
        // Reset Form
        inputs[0].value = "";
        //count value
        countFind();
    };
    $('#inpiytype').keypress(function (e) {
         var key = e.which;
         if(key == 13)  // 13 is  key code for enter
          {
            todo.add();
            return false;  
          }
        });

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {
        data = {};
        localStorage.setItem("todoData", JSON.stringify(data));
        $("." + defaults.todoTask).remove();
        //count value
        countFind();
    };

})(todo, data, jQuery);