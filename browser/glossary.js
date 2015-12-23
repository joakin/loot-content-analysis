const restbaseExample = 'https://en.wikipedia.org/api/rest_v1/page/html/Wikipedia'

export default [
  { term: 'loot', value: `
Transformations by the reading-web-research prototype api server. Based of
RestBase parsoid api, it applies the "no navboxes", "no amboxes", "no
references", "no html comments" and "no data-mw attributes".
    ` },
  { term: 'restbase', value: `
<a href="${restbaseExample}">Parsoid endpoint exposed via restbase</a>
    ` },
  { term: 'wikipedia', value: `
MediaWiki api using action=parse. Returns only the html.
    ` },
  { term: 'mobileview', value: `
MediaWiki api using action=mobileview. Returns only the html.
    ` },
  { term: 'loot-*', value: `
Transformations made by loot, only the ones specified after loot-. Example:
  loot-nodatamw is restbase page without data-mw attributes.
  loot-nodatamw-noreferences is restbase page without data-mw attributes and
without references.
    ` },
  { term: 'extraneous-markup', value: `
Transformation made by loot. Removes <code>typeof</code>,
<code>rel="mw:WikiLink"</code> and <code>about</code> attributes,
parsoid-generated IDs, and transforms <code>mw:Entity</code>s.
    ` }
]
