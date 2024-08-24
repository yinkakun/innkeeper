export class Fragment {
  private _content: string;
  private _isHidden: boolean;
  private _isQuoted: boolean;
  private _isSignature: boolean;

  constructor(content: string, isHidden: boolean, isSignature: boolean, isQuoted: boolean) {
    this._content = content;
    this._isQuoted = isQuoted;
    this._isHidden = isHidden;
    this._isSignature = isSignature;
  }

  isHidden() {
    return this._isHidden;
  }

  isSignature() {
    return this._isSignature;
  }

  isQuoted() {
    return this._isQuoted;
  }

  getContent() {
    return this._content;
  }

  isEmpty() {
    return '' === this.getContent().replace(/\n/g, '');
  }

  toString() {
    return this.getContent();
  }
}
export class FragmentDTO {
  lines: string[];
  isQuoted: boolean;
  isHidden: boolean;
  isSignature: boolean;

  constructor() {
    this.lines = [];
    this.isHidden = false;
    this.isQuoted = false;
    this.isSignature = false;
  }
}
