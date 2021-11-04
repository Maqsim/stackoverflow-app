import parse, { domToReact, Element } from 'html-react-parser';
import { ExternalLink } from '../components/posts/ExternalLink';
import { Code } from '../components/posts/Code';
import { Snippet } from '../components/posts/Snippet';

function parseBody(text: string) {
  return parse(text, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'a' && (domNode.children[0] as any).name !== 'img') {
        return <ExternalLink href={domNode.attribs.href}>{domToReact(domNode.children)}</ExternalLink>;
      }

      if (domNode instanceof Element && domNode.name === 'code') {
        return <Code fontSize="13px">{domToReact(domNode.children)}</Code>;
      }

      if (domNode instanceof Element && domNode.name === 'pre') {
        return <Snippet>{domToReact(domNode.children)}</Snippet>;
      }
    }
  });
}

export default parseBody;
