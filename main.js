$(document).ready(() => {
    var site = "https://fathomless-woodland-51903.herokuapp.com"
    $.getJSON({
        url: `${site}/todos`,
        headers: {
            "Authorization": "Token token=supadupasecret"
        },
        success: (response) => {
            var taskHTML = response.data.map((task) =>
                `<li data-id=${task.id} class="list-item ${task.attributes["is-complete"]}">
${task.attributes.todo} class=${task.attributes["is-complete"]}<button class="delete">Delete</button>
<input class="complete-button checkbox ${task.attributes["is-complete"]}" type="checkbox"></li>`
            );

            // var $checkbox = $("input[type="checkbox"]");
      //       // $
      //       var $checkBox = $(".checkbox");
      //       if ($checkBox.hasClass("true")) {
      //
      //         console.log('hi');
      //   $listItem.find("input[type="checkbox"]").addAttr("checked");
      // }

            $("#to-do-list").append(taskHTML.join("\n"));
            countChecked();
            $("input[type=checkbox]").on("click", countChecked);
        }
    });



    var countChecked = function() {
        var n = $("li").length - $("input:checked").length;
        $("div").text(n + (n === 1 ? " is" : " items are") + " left!");
    };


    // TRYING TO GET CHECKBOXES CONNECTED TO SERVER

    $("#to-do-list").on("click", ".complete-button", function(event) {
        var item = $(event.target).parent()
        var isItemCompleted = item.hasClass("completed")
        var itemId = item.attr("data-id")
        alert("clicked item " + itemId + ", which has completed currently set to " + isItemCompleted)
        console.log("This is confusing");

        var updateRequest = $.ajax({
            type: "PUT",
            url: `${site}/todos/` + itemId,
            headers: {
                "Authorization": "Token token=supadupasecret"
            },
            data: {
                todo: {isComplete: !isItemCompleted}
            }
        })
        updateRequest.done(function(itemData) {
            if (itemData.data.attributes["is-complete"]) {
                item.addClass("completed")
            } else {
                item.removeClass("completed")
            }
        })
    })

    // `${site}todos/${self.parent().data("id")}`,

    // TRYING TO GET CHECKBOXES CONNECTED TO SERVER


    // .change
    // input:checked
    // isComplete === true;
    //
    // retrieve from the server which checkboxes are checked
    // create a change function that posts to the server if the
    // checkbox has been checked
    // changes the value of the key for the list item object


    $("form").submit(function(event) {
        $.post({
            url: `${site}/todos`,
            headers: {
                "Authorization": "Token token=supadupasecret"
            },
            data: $(this).serialize(),
            success: function(response) {
                $("#to-do-list li:last").data("id", response.data.id)
            }
        });
        var taskHTML = `<li>${$(this).find("input").val()}</li>`;
        $("#to-do-list").append(taskHTML);

        event.preventDefault();
        // want the inputs to clear

        $("input").val("");

    })

    $("#to-do-list").on("click", ".delete", function(event) {
        var self = $(this);
        $.ajax({
            type: "DELETE",
            url: `${site}todos/${self.parent().data("id")}`,
            headers: {
                "Authorization": "Token token=supadupasecret"
            },
            success: function(data) {
                self.parent().remove();
            }
        })
    })

})
