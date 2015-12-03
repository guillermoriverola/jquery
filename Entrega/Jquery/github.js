var API_BASE_URL = "https://api.github.com";
var USERNAME = "guillermoriverola";
var PASSWORD = "g02129254";

$.ajaxSetup({
    headers: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD) }
});

/*
Details about repository of GitHub API 
https://developer.github.com/v3/repos/
*/

$("#button_get_repo").click(function(e) {
	e.preventDefault();
	getRepo($("#repository_name").val());
});

$("#button_get_repo2").click(function(e) {
	e.preventDefault();
	getRepo2($("#repository_name_get_to_edit").val());
});

$("#button_get_repos").click(function(e) {
	e.preventDefault();
	var url = API_BASE_URL + '/users/' + USERNAME + '/repos?per_page=5';
	getRepos(url);
});

$("#button_edit_repo").click(function(e) {
	e.preventDefault();	
	
    var repo = new Object();
	repo.name = $("#repository_name_get_to_edit").val();
	repo.description = $("#description_get_to_edit").val();
		
	updateRepo(repo);
});

$("#button_to_delete").click(function(e) {
	e.preventDefault();
	deleteRepo();	
});		
	
$("#button_to_create").click(function(e) {
	e.preventDefault();

    var newRepo = new Object();
	newRepo.name = $("#repository_name_to_create").val();
	newRepo.description = $("#description_to_create").val();
 	newRepo.homepage = "https://github.com";
 	newRepo.private = false;
	newRepo.has_issues = true;
	newRepo.has_wiki = true;
	newRepo.has_downloads = true;

	createRepo(newRepo);
});



function getRepos(url) {	
	$("#repos_result").text('');	

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
        	var response = data;
		var repoCollection = new RepoCollection(response);
                var linkHeader = jqxhr.getResponseHeader('Link');
                repoCollection.buildLinks(linkHeader);

		var html = repoCollection.toHTML();
		$("#repos_result").html(html);

	}).fail(function(jqXHR, textStatus) {
		console.log(textStatus);
	});

}

function RepoCollection(repoCollection){
	this.repos = repoCollection;

	var instance = this;

	this.buildLinks = function(header){
		if (header != null ) {
			this.links = weblinking.parseHeader(header);
		} else {
			this.links = weblinking.parseHeader('');
		}
	}

	this.getLink = function(rel){
                return this.links.getLinkValuesByRel(rel);
	}

	this.toHTML = function(){
		var html = '';
		$.each(this.repos, function(i, v) {
			var repo = v;			
			html = html.concat('<br><strong> Name: ' + repo.name + '</strong><br>'+
			'<strong> ID: </strong> ' + repo.id + '<br>'+
			'<strong> URL: </strong> ' + repo.html_url + '<br>'+
			'<strong> Description: </strong> ' + repo.description + '<br>');
			
		});
		
		html = html.concat(' <br> ');

                var prev = this.getLink('prev');
		if (prev.length == 1) {
			html = html.concat(' <a onClick="getRepos(\'' + prev[0].href + '\');" style="cursor: pointer; cursor: hand;">[Prev]</a> ');
		}
                var next = this.getLink('next');
		if (next.length == 1) {
			html = html.concat(' <a onClick="getRepos(\'' + next[0].href + '\');" style="cursor: pointer; cursor: hand;">[Next]</a> ');
		}

 		return html;	
	}

}

function getRepo(repository_name) {
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name;
	$("#get_repo_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var repo = data;

				$("#get_repo_result").text('');
				$('<strong> Name: ' + repo.name + '</strong><br>').appendTo($('#get_repo_result'));
				$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#get_repo_result'));
				$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#get_repo_result'));
				$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#get_repo_result'));

			}).fail(function() {
				$('<div class="alert alert-danger"> Repositorio no encontrado </div>').appendTo($("#get_repo_result"));
	});

}

function getRepo2(repository_name_get_to_edit) {
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repository_name_get_to_edit;
	$("#get_repo_result2").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var repo = data;

				$("#get_repo_result2").text('');
				$('<strong> Name: ' + repo.name + '</strong><br>').appendTo($('#get_repo_result2'));
				$('<strong> ID: </strong> ' + repo.id + '<br>').appendTo($('#get_repo_result2'));
				$('<strong> URL: </strong> ' + repo.html_url + '<br>').appendTo($('#get_repo_result2'));
				$('<strong> Description: </strong> ' + repo.description + '<br>').appendTo($('#get_repo_result2'));

			}).fail(function() {
				$('<div class="alert alert-danger"> Repositorio no encontrado </div>').appendTo($("#get_repo_result2"));
	});

}

function updateRepo(repo) {
	
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + repo.name;
	var data = JSON.stringify(repo);
	
	$("#update_result").text('');
	
	$.ajax({
		url : url,
		type : 'PATCH',
		crossDomain : true,
		dataType : 'json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Created</div>').appendTo($("#update_result"));
	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#update_result"));
	});	

}

function deleteRepo() {
	REPO_NAME = $("#repository_name_to_delete").val();
	var url = API_BASE_URL + '/repos/' + USERNAME + '/' + REPO_NAME;
	
	$("#delete_result").text('');

	$.ajax({
		url : url,
		type : 'DELETE',
		crossDomain : true,
		dataType : 'json',		
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> Repositorio eliminado</div>').appendTo($("#delete_result"));		
				
  	}).fail(function() {
		$('<div class="alert alert-danger">  Error </div>').appendTo($("#delete_result"));
	});

}

function createRepo(newRepo) {
	var url = API_BASE_URL + '/user/repos';
	var data = JSON.stringify(newRepo);

	$("#create_result").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Repository Created</div>').appendTo($("#create_result"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#create_result"));
	});

}

