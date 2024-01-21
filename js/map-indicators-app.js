"use strict";

document.addEventListener('DOMContentLoaded', function () {

	const indicatorMap = document.querySelector("#indicator-map");
	const xhrIndicatorMap = new XMLHttpRequest;
	const parser = new DOMParser;

	if (indicatorMap) {
		xhrIndicatorMap.open("get", "files/house-data.xml", true);
		xhrIndicatorMap.send();
		xhrIndicatorMap.onreadystatechange = function readXML() {
			if (xhrIndicatorMap.readyState == 4) {

				if (xhrIndicatorMap.status == 200) {
					let indicatorMapData = parser.parseFromString(xhrIndicatorMap.responseText, "text/xml");
					let houses = indicatorMapData.getElementsByTagName("house");
					for (var i = 0; i < houses.length; i++) {
						let keyName = houses[i].getElementsByTagName("keyname")[0].textContent;
						let coordX = houses[i].getElementsByTagName("coordx")[0].textContent;
						let coordY = houses[i].getElementsByTagName("coordy")[0].textContent;
						let originalTitle = houses[i].getElementsByTagName("originaltitle")[0].textContent;
						let angle = houses[i].getElementsByTagName("angle")[0].textContent;

						// Create the indicator__wrapper div element
						let indicatorWrapper = document.createElement('div');
						indicatorWrapper.className = 'indicator__wrapper';
						// Set the styles and data-attribute
						indicatorWrapper.style.top = coordY + 'px';
						indicatorWrapper.style.left = coordX + 'px';
						indicatorWrapper.style.rotate = angle + 'deg';
						indicatorWrapper.setAttribute('data-keyname', keyName);
						indicatorWrapper.setAttribute('data-original-title', originalTitle);

						// Add the inner pins
						indicatorWrapper.innerHTML = `
                        <div class="indicator__pin indicator__pin_green"></div>
                        <div class="indicator__pin indicator__pin_yellow"></div>
                        <div class="indicator__pin indicator__pin_red"></div>
                    `;
						// Append the indicator__wrapper to the map
						indicatorMap.appendChild(indicatorWrapper);


					}


				}
				if (xhrIndicatorMap.status === 404) {
					indicatorMap.insertAdjacentHTML("beforeend", '<h3 class="error-message">Something has gone wrong<br>Try again later</h3>');
					console.log("File of resource not found");
				}
			}
		};
	}
});

