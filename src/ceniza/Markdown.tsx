import { Fragment, type ReactNode } from 'react';

// Solo el subconjunto editorial utilizado por los archivos originales. Sin HTML inyectado.
function inline(value: string): ReactNode[] {
  return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].startsWith('/') && !link[2].startsWith('/ceniza') ? '/ceniza' + link[2].replace(/\/$/, '') : link[2];
      return <a key={i} href={href}>{link[1]}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
export default function Markdown({ body }: { body: string }) {
  return <div className="cn-prose">{body.split(/\n\s*\n/).map((block, i) => {
    if (block.startsWith('![')) return null; // Capturas editoriales elegidas se muestran fuera del texto.
    if (block.startsWith('## ')) return <h3 key={i}>{inline(block.slice(3))}</h3>;
    if (block.startsWith('|')) {
      const rows = block.split('\n').filter(row => !/^\|[\s:|-]+\|$/.test(row)).map(row => row.split('|').slice(1, -1).map(cell => cell.trim()));
      return <div key={i} className="cn-table-scroll" tabIndex={0}><table><thead><tr>{rows[0].map((cell, j) => <th key={j} scope="col">{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
    }
    if (block.startsWith('- ')) return <ul key={i}>{block.split('\n').map((line, j) => <li key={j}>{inline(line.replace(/^- /, ''))}</li>)}</ul>;
    return <p key={i}>{inline(block)}</p>;
  })}</div>;
}
