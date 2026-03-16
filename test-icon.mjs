import * as ReactDOMServer from 'react-dom/server';
import React from 'react';

const RefreshCw = ({ className, size, ...props }) => React.createElement('svg', { className: ['lucide', 'lucide-refresh-cw', className].join(' '), width: size, height: size, ...props });
const sizeIcon = (node) => React.cloneElement(node, { size: 24 });
const html = ReactDOMServer.renderToStaticMarkup(sizeIcon(React.createElement(RefreshCw, { className: "transition-transform duration-300 group-hover:rotate-90" })));
console.log(html);
