import { errorLogger } from "@config/winston";
import sharp from "sharp";

export default class ImageRezizator {
  private _input: Buffer;
  private _output: string;
  private _WIDTH = 363;
  private _HEIGHT = 274;

  constructor(input: Buffer, output: string) {
    this._input = input;
    this._output = output;
  }

  public async resizator() {
    try {
      await sharp(this._input).resize({ height: this._HEIGHT, width: this._WIDTH, fit: "contain", background: "white" }).toFile(this._output);
      return true;
    } catch (error) {
      errorLogger.error(`${error.status || 500} - [src/utils/ImageRezizator ()=> rezizator] - ${error.message}`);
      console.log("error: ", error);
      return false;
    }
  }
}
