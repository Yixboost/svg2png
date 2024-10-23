document.addEventListener("DOMContentLoaded", () => {
	const fileInput = document.getElementById("svg-file-input");
	const form = document.getElementById("resizeForm");
	const convertToPngBtn = document.getElementById("convertToPngBtn");
	const svgContainer = document.getElementById("svgContainer");
	const dimensionsDiv = document.getElementById("currentDimensions");

	let svgElement = null;
	let svgWidth = 0;
	let svgHeight = 0;

	fileInput.addEventListener("change", (event) => {
		const file = event.target.files[0];
		if (file && file.type === "image/svg+xml") {
			const reader = new FileReader();
			reader.onload = (e) => {
				const svgContent = e.target.result;
				svgContainer.innerHTML = svgContent;
				svgElement = svgContainer.querySelector("svg");
				if (svgElement.hasAttribute("width") && svgElement.hasAttribute("height")) {
					svgWidth = svgElement.getAttribute("width");
					svgHeight = svgElement.getAttribute("height");
				} else {
					const viewBox = svgElement.getAttribute("viewBox");
					if (viewBox) {
						const viewBoxValues = viewBox.split(" ");
						svgWidth = viewBoxValues[2];
						svgHeight = viewBoxValues[3];
					}
				}
				updateDimensionsDiv(svgWidth, svgHeight);
				dimensionsDiv.style.display = "block";
				form.style.display = "block";
			};
			reader.readAsText(file);
		} else {
			alert("Please upload a valid SVG file.");
		}
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		convertToPngBtn.style.display = "block";

		if (svgElement) {
			const width = document.getElementById("width").value;
			const height = document.getElementById("height").value;

			resizeSVG(width, height);
		}
	});

	convertToPngBtn.addEventListener("click", () => {
		if (svgElement) {
			convertSVGToPNG(svgElement);
		}
	});

	function resizeSVG(width, height) {
		svgElement.setAttribute("width", width);
		svgElement.setAttribute("height", height);
		svgWidth = width;
		svgHeight = height;
	}

	function convertSVGToPNG(svgElement) {
		const svgData = new XMLSerializer().serializeToString(svgElement);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.onload = () => {
			canvas.width = svgWidth;
			canvas.height = svgHeight;
			ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
			const pngFile = canvas.toDataURL("image/png");
			downloadPNG(pngFile);
		};

		img.onerror = (error) => {
			console.error("Error loading SVG image:", error);
		};

		const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
		const url = URL.createObjectURL(svgBlob);
		img.src = url;
	}

	function updateDimensionsDiv(width, height) {
		dimensionsDiv.textContent = `Current SVG dimensions: ${width} x ${height}`;
	}

	function downloadPNG(dataUrl) {
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "converted-image.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
});
