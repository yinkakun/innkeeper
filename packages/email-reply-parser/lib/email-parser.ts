import { regexList } from './regex';
import { Fragment, FragmentDTO } from './fragment';

const QUOTE_REGEX = /(>+)$/;

export class EmailParser {
  private fragments: FragmentDTO[];

  constructor() {
    this.fragments = [];
  }

  private stringReverse(text: string) {
    return text.split('').reverse().join('');
  }

  private stringRTrim(text: string, mask: string): string {
    return text.replace(new RegExp(`${mask}+$`), '');
  }

  private stringLTrim(text: string) {
    return text.replace(/^\s+/, '');
  }

  parse(text: string) {
    text = text.replace(/\r\n/g, '\n');
    text = this.fixBrokenSignatures(text);

    let fragment: FragmentDTO | null = null;

    this.stringReverse(text)
      .split('\n')
      .forEach((line) => {
        line = this.stringRTrim(line, '\n');

        if (!this.isSignature(line)) {
          line = this.stringLTrim(line);
        }
        if (fragment) {
          let last = fragment.lines[fragment.lines.length - 1];
          if (this.isSignature(last)) {
            fragment.isSignature = true;
            this.addFragment(fragment);
            fragment = null;
          } else if (line === '' && this.isQuoteHeader(last)) {
            fragment.isQuoted = true;
            this.addFragment(fragment);
            fragment = null;
          }
        }

        let isQuoted = this.isQuote(line);

        if (fragment === null || !this.isFragmentLine(fragment, line, isQuoted)) {
          if (fragment !== null) {
            this.addFragment(fragment);
          }

          fragment = {
            lines: [],
            isHidden: false,
            isQuoted,
            isSignature: false,
          };
        }

        fragment.lines.push(line);
      });

    if (fragment !== null) {
      this.addFragment(fragment);
    }

    const email = this.createEmail(this.fragments);

    this.fragments = [];

    return email;
  }

  private fixBrokenSignatures(text: string) {
    let newText = text;
    // For any other quote header lines, if we find one of them,
    //  remove any new lines that happen to match in the first capture group
    regexList.quoteHeadersRegex.forEach((regex: RegExp) => {
      const matches = newText.match(regex);
      if (matches && matches[1]) {
        // const [matchingString, matchGroup] = matches;
        newText = newText.replace(matches[1], matches[1].replace(/\n/g, ' '));
      }
    });

    return newText;
  }

  getQuoteHeadersRegex(): RegExp[] {
    return regexList.quoteHeadersRegex;
  }

  setQuoteHeadersRegex(quoteHeadersRegex: RegExp[]) {
    quoteHeadersRegex.forEach((regex) => {
      regexList.addQuoteHeaderRegex(regex);
    });
    return this;
  }

  private createEmail(fragmentDTOs: FragmentDTO[]): Email {
    const fragments: Fragment[] = fragmentDTOs
      .reverse()
      .map(
        (fragment) =>
          new Fragment(
            this.stringReverse(fragment.lines.join('\n')).replace(/^\n/g, ''),
            fragment.isHidden,
            fragment.isSignature,
            fragment.isQuoted,
          ),
      );

    return new Email(fragments);
  }

  private isQuoteHeader(line?: string) {
    if (!line) return false;
    return regexList.quoteHeadersRegex.some((regex) => regex.test(this.stringReverse(line)));
  }

  private isSignature(line?: string) {
    if (!line) return false;
    const text = this.stringReverse(line);
    return regexList.signatureRegex.some((regex: RegExp) => regex.test(text));
  }

  private isQuote(line: string) {
    return QUOTE_REGEX.test(line);
  }

  private isEmpty(fragment: FragmentDTO) {
    return fragment.lines.join('') === '';
  }

  private isFragmentLine(fragment: FragmentDTO, line: string, isQuoted: boolean) {
    return fragment.isQuoted === isQuoted || (fragment.isQuoted && (this.isQuoteHeader(line) || line === ''));
  }

  private addFragment(fragment: FragmentDTO): void {
    if (fragment.isQuoted || fragment.isSignature || this.isEmpty(fragment)) {
      fragment.isHidden = true;
    }

    this.fragments.push(fragment);
  }
}

class Email {
  private fragments: Fragment[];

  constructor(fragments: Fragment[] = []) {
    this.fragments = fragments;
  }

  getFragments() {
    return this.fragments;
  }

  getVisibleText() {
    return this.filterText((fragment) => {
      return !fragment.isHidden();
    });
  }

  getQuotedText() {
    return this.filterText((fragment) => {
      return fragment.isQuoted();
    });
  }

  filterText(filter: (fragment: Fragment) => boolean) {
    let filteredFragments = this.fragments.filter(filter);
    return filteredFragments.join('\n').replace(/~*$/, '');
  }
}
