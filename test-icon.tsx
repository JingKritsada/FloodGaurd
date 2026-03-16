import { renderToString } from 'react-dom/server';
import React, { cloneElement } from 'react';
import { RefreshCw } from 'lucide-react';

const sizeIcon = (node) => cloneElement(node, { size: 24 });
const html = renderToString(sizeIcon(<RefreshCw className="transition-transform duration-300 group-hover:rotate-90" />));
console.log(html);
