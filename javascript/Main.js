/**
 * Simple object to manage the AJAX calls.
 */


var ReBeat = {

	/**LOAD POPULAR VIDEOS**/
	mostPopular : function(){

		if($('#init')) {
			$('#init').remove();
		}

		var api_url_most_popular = "http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=alternative&api_key=3650f6bba8e0bc1f9d41f6ae860cb18f&format=json";
		var dades = AJAX.request(api_url_most_popular);

		
		var thumbnail = [];
		var name = [];
		var album = [];

		var div = Layout.createContainer("init", "div");
		document.body.appendChild(div);

		var list_item = Layout.createContainer("popularTracks", "ul");
		list_item.addEventListener("click", this.clickResponse);
		document.body.appendChild(list_item);

		var title;
		var image;
		var src;
		var basicBloc;

		var i=1;
		for(j=1; j<dades.toptracks.track.length; j++){

			if(dades.toptracks.track[j].image){

				thumbnail[i]=dades.toptracks.track[j].image[3]["#text"];
				name[i] = dades.toptracks.track[j].name;
				album[i] = dades.toptracks.track[j].artist.name;
				name[i] = name[i].replace(/[.',!]/g, " ");
				album[i] = album[i].replace(/[.',!]/g," ");
				
		
				//creo els contenidors de cada cosa
				title = Layout.createContainer(i, "p");
				image = this.render(thumbnail[i], name[i]);

				title.innerHTML = name[i];

				basicBloc = Layout.createContainer("basicBloc"+i, "li");
				basicBloc.setAttribute("data-name",name[i]);
				basicBloc.setAttribute("data-album",album[i]);
				basicBloc.appendChild(title);
				basicBloc.appendChild(image);

				list_item.appendChild(basicBloc);
				div.appendChild(list_item);
				i++;
			}
		}
	},

	/**RETURNS A LINK TO A SONG PLAYER**/
	spotifyPlayLink : function(name, album, action){
		
		var dades = AJAX.request("https://api.spotify.com/v1/search?q="+name+"+"+album+"&type=track");
		var aux = [];
		
		if(dades.tracks.items.length==0){
			return null;
		}
		if(action==1){

			return dades;
		}
		if(action==0){
			aux[0] = dades.tracks.items[0].preview_url;
			aux[1] = dades.tracks.items[0].uri;
			//dades = dades.replace("open","play");
			
			return aux;
		}
		
	},

	clickResponse : function(e){

		var list_item;
		var name;
		var album;
		var src;

		if($(".addB").length) {
					
		}
		else{
			if(e.target.nodeName == "IMG"){
				list_item = e.target.parentNode.parentNode;
			}
			else{
				if(e.target.nodeName == "P"){
					list_item = e.target.parentNode;
				}
				else list_item = e.target;
			}
			
			name = list_item.getAttribute("data-name");
			album = list_item.getAttribute("data-album");
			
			src = aux.spotifyPlayLink(name, album, 0);

			aux.embeding(src);
		}
	},

	/**CREATE FIGURES WHEN NEEDED**/
	render : function(thumbnail, name){
		var figure = document.createElement("figure");

    	var img = Layout.createImage(thumbnail, name);

	    figure.appendChild(img);

	    return figure;
	},
	
	loadsearchEngine : function(){
		AJAX.searchEngine();
	},

	/**EMBED ELEMENTS ACCORDING TO A SRC**/
	embeding : function(src){
		var auxiliar;
		auxiliar = Layout.createContainer("init","div");
		auxiliar.innerHTML="<iframe src='https://embed.spotify.com/?uri="+src[1]+"' id='embed' width=80% height=100% frameborder='0' allowtransparency='true'></iframe><br><iframe src="+src[0]+" width=1% height=1% frameborder='0' allowtransparency='true'>";

		$("#init").replaceWith(auxiliar);
	},
	loadSearchResults : function(dades, fin){
		var thumbnail = [];
		var name = [];
		var album = [];
		var title;
		var image;
		var div = Layout.createContainer("init", "div");
		if(fin==15){
			$("#init").remove();
		}
		

		document.body.appendChild(div);
		var listedResult = Layout.createContainer("listedResult", "ul");
		listedResult.addEventListener("click", aux.clickResponse);

		for(i=1; i<fin; i++){
		
			if(dades.tracks.items[i].hasOwnProperty('album') && dades.tracks.items[i].album.hasOwnProperty('images')){

				thumbnail[i] = dades.tracks.items[i].album.images[1].url;
				name[i] = dades.tracks.items[i].name;
				album[i] = dades.tracks.items[i].album.name;
				name[i] = name[i].replace(/[.',!]/g, " ");
				album[i] = album[i].replace(/[.',!]/g," ");
				
				//creo els contenidors de cada cosa
				title = Layout.createContainer(i, "p");
				image = this.render(thumbnail[i], name[i]);
				title.innerHTML = name[i];
				basicBloc = Layout.createContainer("basicBloc"+i, "li");
				basicBloc.setAttribute("data-name",name[i]);
				basicBloc.setAttribute("data-album",album[i]);
				basicBloc.appendChild(title);
				basicBloc.appendChild(image);
				listedResult.appendChild(basicBloc);
				div.appendChild(listedResult);
			}
			
		}

	}
}

var AJAX = {
	request: function(url){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		
		xhr.send();
		var ans = JSON.parse(xhr.responseText);

		return ans;
	},
	loadTracks: function(query){
		var dades = this.request("https://api.spotify.com/v1/search?q="+query+"&type=track");
		return dades;
	},
	/**IMPLEMENTS THE SEARCH ENGINE**/
	searchEngine: function(){
		var query = document.getElementById("buscador").value;

		if(query != '') {
			var i = 15;
			var searchOptions = [];
			var arr;
			//$("#buscador").replace("","");
			searchOptions = this.loadTracks(query);

			if($('#datalist1')) {
				$('#datalist1').remove();
			}
			var insert = document.createElement('datalist');
			document.body.appendChild(insert);
			$("datalist").attr('id', 'datalist1');
			
			if(query!=undefined)
				aux.loadSearchResults(searchOptions, i);
		}
		else{aux.mostPopular();}
	},
	loadContainer: function(element,id,item){
		var container = document.createElement(element);
		container.id = id;

		document.getElementById(item).appendChild(container);
	}

}


var Layout = {
	createContainer: function(id, element){
    	var container = document.createElement(element);
		container.id = id;

		return container;
    },
    createLink: function(src, element, srcE){
    	var container = document.createElement('a');
    	container.href = src;
    	var content;

    	if(element=='img'){
    		content = document.createElement('img');
    		content.src=srcE;
    	}else{
    		content = document.createElement(element);
    		content.innerHTML=srcE;
    	}
    	container.appendChild(content);

    	return container;

    },
    createImage: function(thumbnail, name){
    	var img = document.createElement("img");
	    img.src = thumbnail;
	    img.alt = name;
	    return img;
    },
    renderContainer: function(container){
    	document.body.appendChild(container);
    },
}

var Menu = {

	createMenu: function(q){

		if($("#actions").length) {
			
		}else{
			var init = document.getElementById("init");
			var tools = Layout.createContainer("actions", "div");
			var options = Layout.createContainer("opciones", "ul");

			tools.appendChild(options);
			document.body.insertBefore(tools, init);

			var butAP = Layout.createContainer("AP", "button");
			var butS = Layout.createContainer("S", "button");
			var butT = Layout.createContainer("T", "button");

			var nodeAP = document.createElement("li");
			var nodeS = document.createElement("li");
			var nodeT = document.createElement("li");

			var textnode = document.createTextNode("Add to Playlist");
			butAP.appendChild(textnode);
			nodeAP.appendChild(butAP);
			document.getElementById("opciones").appendChild(nodeAP);

			textnode = document.createTextNode("Suggestions");
			butS.appendChild(textnode);
			nodeS.appendChild(butS);
			document.getElementById("opciones").appendChild(nodeS);

			textnode = document.createTextNode("Tools");
			butT.appendChild(textnode);
			nodeT.appendChild(butT);
			document.getElementById("opciones").appendChild(nodeT);

			$("#AP").on('click', function () {
	   			 Menu.showPlaylist(q);
	  		})

	  		$("#S").on('click', function () {
	  			 q++;
	   			 Menu.suggestions(q);
	  		})
  		}
	},

	showPlaylist: function(q){
		if($("#selectPlaylist").length) {
			
		}else{
			var init = document.getElementById("init");
			var tools = Layout.createContainer("selectPlaylist", "div");
			var options = Layout.createContainer("playlist", "ul");

			tools.appendChild(options);
			$(tools).insertAfter(init);

			var defaultPlaylist = Layout.createContainer("dPl", "button");

			var playlist0 = document.createElement("li");

			var textnode = document.createTextNode("CreatePlaylist");
			defaultPlaylist.appendChild(textnode);
			playlist0.appendChild(defaultPlaylist);
			document.getElementById("playlist").appendChild(playlist0);

			$("#dPl").on('click', function () {
	   			 Menu.CreatePlaylist(q);
	  		})
		}
	},

	CreatePlaylist: function(q){
		var i = 0;
		//q=0;
		AJAX.loadContainer("li","inputlist","playlist");
		AJAX.loadContainer("input","newlist","inputlist");
		AJAX.loadContainer("button","add", "inputlist");

		$("#add").on('click', function () {
			var imB = Layout.createImage("img/playB.png","play");
		    var name = $("#newlist").val();
		    var newButton = Layout.createContainer("dPl "+name+"Button","button");
		    var playButton = Layout.createContainer("pB "+q, "button");
		    imB.style.height= '100%';
		    playButton.style.marginLeft = '5px';
		    playButton.style.height = '5%';
		    playButton.style.marginTop = '13%';
		    playButton.appendChild(imB);
		    newButton.innerHTML = name;
		    AJAX.loadContainer("li",name,"playlist");
		    document.getElementById(name).style.display = 'inline-flex';
		    document.getElementById(name).style.width = '99%';
		    document.getElementById(name).appendChild(newButton);
		    document.getElementById(name).appendChild(playButton);
		    q++;
	    	$(newButton).on('click', function () {
   				Menu.Selectsongs(name);
  			})

  			$(playButton).on('click', function () {
  				var id = this.getAttribute("id");
  				id = id.replace("pB ","");
  				Menu.playPlaylist(id,1);
  			})
		})
	},

	playPlaylist: function(id,i){
		var aux;
		var longitud = matrix[id].length;
		aux = matrix[id][i].split(":");
		ReBeat.embeding(ReBeat.spotifyPlayLink(aux[0],aux[1],0));
		aux[0] = Layout.createContainer("next","button");
   		aux[1] = Layout.createImage("img/next.png","proxim");
   		aux[1].style.height = '14%';
   		aux[0].style.float = 'right';
   		aux[0].style.right = '26%';
   		aux[0].style.position = 'fixed';
   		aux[0].style.top = '37vh';
   		aux[0].appendChild(aux[1]);
   		document.getElementById("init").appendChild(aux[0]);

   		i++;
   		$(aux[0]).on('click', function () {
   			if(i==longitud){
   				$("#init").remove();
    			ReBeat.mostPopular();
   			}
  			Menu.playPlaylist(id,i);
  		})

	},

	Selectsongs: function(list){
		
		if($("#listedResult").length) {
			var longitude = document.getElementById("listedResult").childNodes.length;			
		}
		else{
			var longitude = document.getElementById("popularTracks").childNodes.length;
		}
		
		var album = [];
		var name = [];
		var bt;
		var img;
		var aux = [];

		while(longitude > 0){
			album[longitude] = $("#basicBloc"+longitude).attr("data-album");
			name[longitude] = $("#basicBloc"+longitude).attr("data-name");
			bt = Layout.createContainer(name[longitude]+":"+album[longitude]+"-"+longitude,"button");
			img = Layout.createImage("img/add.jpg","provisional");
			img.style.height = '19px';
			img.style.width = '19px';

			bt.appendChild(img);
			bt.style.height = '22px';
			bt.style.width = '22px';
			bt.style.paddingLeft = '0px';
			bt.style.paddingTop = '0px';
			bt.style.marginLeft = '3px';
			$(bt).addClass("addB");
			document.getElementById(longitude).appendChild(bt);
			longitude--;
		}

		$(".addB").on('click', function(){
			console.log("primer afegir");
			bt = this.getAttribute("id");
			aux = bt.split("-");
			Menu.PlayListManager(aux[0],list);
		})
	},

	suggestions: function(q){

		var Name;
		var dades;
		var fin = 5;
		$("#init").remove();

		for(j=0; j<matrix.length; j++){


			if(matrix[j][q]!=undefined){
				Name = matrix[j][q].split(":");
				dades = AJAX.request("https://api.spotify.com/v1/search?q="+Name[1]+"&type=track");
				ReBeat.loadSearchResults(dades, fin);
			}
			else{
				$("#init").remove();
   				 ReBeat.mostPopular();
			}
			
		}
	},

	PlayListManager: function(song, playlist){

		var bool = false;

		for(i=0; i<matrix.length; i++){

			if(matrix[i][0] == playlist){
				matrix[i].push(song);//pe
				bool = true;
			}

		}

		if(bool == false){
			var longitud = matrix.length;
			matrix[longitud] = [];
			matrix[longitud].push(playlist);//pe
			matrix[longitud].push(song);
			bool = true;
		}
	}
}

var matrix = [];
var aux = ReBeat;

aux.mostPopular();
$("#buscador").keyup(aux.loadsearchEngine);

$("#buttonSearch").on('click', function () {
	var q=0;
    Menu.createMenu(q);
})

$("#home").on('click', function () {
	$("#init").remove();
    ReBeat.mostPopular();
})
