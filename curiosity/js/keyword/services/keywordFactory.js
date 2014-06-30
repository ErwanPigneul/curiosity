Curiosity.factory('keyword', function($rootScope, conf){
	var keywordObj = {};
	var keywordArray  = [];

	function findIndexByName(name) {
		var i = 0;
		while (i < keywordArray.length) {
			if (keywordArray[i].index == name ) {
				return (i);
			}
			i++;
		}
		return (-2)
	}

	keywordObj.update = function (){
		keywordArray = conf.getConfDocument("keyword").keywords;
	}

	keywordObj.getIndex = function (index) {
		var result = findIndexByName(index);
		if (result < 0 || typeof(keywordArray[result]) === "undefined"){
			return ([]);
		}
		return (keywordArray[result]);
	}

	keywordObj.saveIndex = function (index, data) {
		// delete space 
		var i = 0; 
		while  (i < data.length) {
			data[i].label = data[i].label.replace(/ /g, "");
			i++;
		}
		var confIndice = conf.getConfDocumentIndice("keyword");
		if (confIndice >= 0) {
			var curIndex = findIndexByName(index);
			if (curIndex >= 0) {
				gConf[confIndice]._source.keywords[curIndex].keywords = data;
			}
			else {
				gConf[confIndice]._source.keywords.push({"index":index, "keywords":data});
			}
			conf.sendConfDocument("keyword");
			$rootScope.$broadcast("KeywordUpdate");
		}
	}

	keywordObj.getKeywordListFromIndex = function (index) {
		var curentKeyword = findIndexByName(index);
		var result = [];
		if (curentKeyword >= 0){
			result = keywordArray[curentKeyword].keywords;
		}
		curentKeyword = findIndexByName("global");
		if (curentKeyword >= 0){
			result = result.concat(keywordArray[curentKeyword].keywords);
		}
		return(result);
	}

	/**
	* getKeywordListFromIndexFilter
	* Find all keywords that begin  by "word" in a specified index
	* @param index : the index to browse
	* @param word : the word to find
	* @result: an array which contains all keyword found.
	*/
	keywordObj.getKeywordListFromIndexFilter = function (index, word) {
		var result = new Array ;
		var i = 0;
		var tmp = escapeRegExp(word)
		var re = new RegExp("^" + tmp + ".*");
		var curentKeyword = keywordObj.getKeywordListFromIndex(index);
		while (i < curentKeyword.length){
			if (re.test(curentKeyword[i].label))
				result.push(curentKeyword[i])
			i++;
		}
		return (result);
	}

	keywordObj.addKeywordInIndex = function(keyword, index) {
		if (index == "") {
			index = "global";
		}
		var indice = findIndexByName(index);
		if (indice >= 0) {
			keywordArray[indice].keywords.push(keyword);	
		}
		else {
			keywordArray.push({"index":index, "keywords":[keyword]})
		}
		conf.sendConfDocument("keyword");
		$rootScope.$broadcast("KeywordUpdate");
	}

	return (keywordObj);
})