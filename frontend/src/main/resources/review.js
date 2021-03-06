$(document).ready(function () {
    function sendPostRequest(id, action) {
        $.post("/quote_review",
            {
                id: id,
                action: action
            }
        )
    }

    function fetchLocationSet() {
        function addLocation(locationContext) {
            const location = locationContext['location'];
            const quote = locationContext['sentence'];
            const id = locationContext['id'];
            const listItem = `<li id=${id}> <b>Location: </b> ${location} <br> ${quote} <br>
                <button name=${id} class="delete">Delete</button> </li>`;
            $(".main").append(listItem);

            $("button.delete").click(function deleteQuote() {
                $.post("/delete", {
                    id: this.name
                });
                $(`#${this.name}`).remove();
            });
        }

        $.get("/unreviewed_locations", {}, function (response) {
            const locations = JSON.parse(response);
            const locationsArray = locations['locations'];
            for (let i = 0; i < locationsArray.length; i++) {
                addLocation(locationsArray[i]);
            }

            $(".main li").click(function () {
                if (this.className !== 'interesting') {
                    this.className = 'interesting';
                    sendPostRequest(this.id, "inc");
                }
            });
        });
    }

    $("button.update").click(function nextSet() {
        $(".main li").each(function () {
            if (this.className !== 'interesting') {
                sendPostRequest(this.id, "dec");
            }
            $(`#${this.id}`).remove();
        });
        fetchLocationSet();
    });

    fetchLocationSet()
});