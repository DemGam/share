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
					indicatorMap.insertAdjacentHTML("beforeend", '<h2 class="error-message">Something has gone wrong<br>Try again later</h2>');
					console.log("File of houses not found");
				}
			}
		};

		// ********************************************
		// This part of code should be corrected by a backend specialist according to the data received
		const xhrIssues = new XMLHttpRequest;

		xhrIssues.open("get", "files/issues.xml", true);
		xhrIssues.send();
		xhrIssues.onreadystatechange = function readXML() {
			if (xhrIssues.readyState == 4) {

				if (xhrIssues.status == 200) {
					let issuesData = parser.parseFromString(xhrIssues.responseText, "text/xml");
					let issues = issuesData.getElementsByTagName("issue");

					for (var i = 0; i < issues.length; i++) {
						let keyName = issues[i].getElementsByTagName("keyname")[0].textContent;
						let alerts = issues[i].getElementsByTagName("alert");

						// Find the corresponding indicator__wrapper element by keyName
						let indicatorWrapper = document.querySelector(`.indicator__wrapper[data-keyname="${keyName}"]`);

						if (indicatorWrapper) {
							// Loop through all alerts for the current issue
							for (let alert of alerts) {
								let alertType = alert.textContent;
								// Find the corresponding indicator__pin by alert type
								let pin = indicatorWrapper.querySelector(`.indicator__pin_${alertType}`);
								if (pin) {
									// Set the visibility of the pin to visible
									// pin.style.display = 'block';
									pin.style.visibility = 'visible';
								}
							}
						}
					}
				}
				if (xhrIssues.status === 404) {
					indicatorMap.insertAdjacentHTML("beforeend", '<h2 class="error-message">Something has gone wrong<br>Try again later</h2>');
					console.log("File of issues not found");
				}

			}
		}
		// ********************************************

	}
});

