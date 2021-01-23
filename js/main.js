window.onload = function() {
    function active(e) {
        // toggle menu, no add class
        e.preventDefault();
        var menu = document.querySelector(".nav-bar").style;

        if (menu.maxHeight == "") {
            menu.maxHeight = "0"
        };
        if (menu.maxHeight == "0px") {
            menu.maxHeight = "18rem";
        } else {
            menu.maxHeight = "0";
        };
    };

    function copy(e, element, obj) {
    	// copy to clipboard the text content of element
        var aux = document.createElement('input'); //create auxiliar input for copy content
        aux.setAttribute('value', element.textContent);
        document.body.appendChild(aux);//add input hidden
        aux.select();
        document.execCommand('copy');
        document.body.removeChild(aux);//delete auxiliar input

        if (!(obj.classList.contains('click'))) {
            obj.classList.add('click');
            obj.textContent = 'Copied!';
        };
    };

    function createNode(data) {
        // create "li" item whit link and short link, "data" is the response of api fetch
        const list = document.getElementById('shortList');

        // create "url" element 
        var pLink = document.createElement("p");
        pLink.textContent = data[0];
        pLink.classList.add('url');

        // create "short link" element
        var pShortLink = document.createElement('p');
        pShortLink.textContent = data[1];
        pShortLink.classList.add('short-url');

        // create button for copy the short link
        var btnCopy = document.createElement('button');
        btnCopy.textContent = 'Copy';
        btnCopy.classList.add('button');
        btnCopy.addEventListener('click', function(event) { copy(event, pShortLink, this) });

        var itemLink = document.createElement('li');
        itemLink.appendChild(pLink);
        itemLink.appendChild(pShortLink);
        itemLink.appendChild(btnCopy);
        itemLink.classList.add('short-item');

        list.appendChild(itemLink);
    };

    function getToStorage(){
    	let originalLink = new Array;
    	let shortLink = new Array;

    	if(!(localStorage.length == 0)){
			originalLink = JSON.parse(localStorage['original']);
			shortLink = JSON.parse(localStorage['short']);
		};

		return [originalLink, shortLink];
    };

    function setToStorage (data){
		let storage = getToStorage();
		
		storage[0].push(data[0]);
		storage[1].push(data[1]);

    	localStorage.setItem('original', JSON.stringify(storage[0]));
    	localStorage.setItem('short', JSON.stringify(storage[1]));
    };

    function apiShrt(e) {
        e.preventDefault();
        this.disabled = true;
        var url = document.getElementById('url');
        if (url.classList.contains('error')) {
            url.classList.remove('error');
        };

        if (url.value === "") {
            url.classList.add('error');
            url.placeholder = 'Please, add a url';
        } else {
            fetch("https://api.shrtco.de/v2/shorten?url=" + url.value)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        createNode([data.result.original_link, data.result.short_link]);
                        setToStorage([data.result.original_link, data.result.short_link]);
                    }else{
                    	url.classList.add('error');
                    	alert(data.error);
                    };
                    url.value = "";
                    url.placeholder = 'Shorten a link here...';
                });
        };
        this.disabled = false;
    };

    var links = getToStorage();

    for(var i = 0; i<links[0].length; i++){
    	createNode([links[0][i], links[1][i]]);
    };

    var btnMenu = document.querySelector(".menu");
    btnMenu.addEventListener("click", active);

    var btnshort = document.querySelector("#shorten");
    btnshort.addEventListener("click", apiShrt);
};