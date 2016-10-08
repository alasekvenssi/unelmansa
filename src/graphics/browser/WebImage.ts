import {Image} from "../Image"

export default class WebImage implements Image {
	public image: HTMLImageElement;
	private _loaded: boolean;

	constructor(public source: string, onLoad?: (img: Image)=>void) {
		this.image = document.createElement("img");
		this._loaded = false;

		this.image.addEventListener("load", () => {
			this._loaded = true;
			if (onLoad) { onLoad(this); }
		});

		this.image.src = source;
	}

	isLoaded(): boolean {
		return this._loaded;
	}

	width(): number {
		return this.image.naturalWidth;
	}

	height(): number {
		return this.image.naturalHeight;
	}
}
