// Based on a Sporif JS script
// https://github.com/Sporif/CustomHooks/blob/master/hooks/theme-css-variables.js

// Tnx to Choc which fixed the script for Vivaldi 3.6+
// https://discord.com/channels/170121320825225218/170121320825225218/810447890169593856

(function() {

	// Send when tab loads
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if(['loading', 'complete'].indexOf(changeInfo.status) > -1){
			send();
		}
	});

	// Send when theme changes
	var observer = new MutationObserver(send);
	observer.observe(document.querySelector('html'), {
		attributes: true,
		attributeFilter: ['style']
	});

	function send() {
		var css = ":root {\n "+document.querySelector('html').style.cssText.replace(/;/g, ';\n').replace(/:/g, ': ')+" }";
		var addCss = `if(!colors){ 
			var colors = document.createElement('style'); 
			colors.setAttribute("description", "Current theme's css variables, added by theme-css-variables.js"); 
		} 
		colors.textContent = \`${css}\`; 
		document.head.appendChild(colors);`;
		chrome.tabs.query({}, function(tabs){
			tabs.forEach(function(tab){
				if(tab.url.startsWith('http://') || tab.url.startsWith('https://')){
					chrome.tabs.executeScript(tab.id, {code: addCss, allFrames: true}, function(){
						if (chrome.runtime.lastError){
							return; // tab was closed, fail silently
						}
					});
				}
			});
		});
	}

})();
