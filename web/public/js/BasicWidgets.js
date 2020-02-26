var SetupAction = (f) => { $(document).ready(() => f()); };
var FormatArgStr = (params) => {
  var ks = Object.keys(params); var argstr = "<";
  var _tag = params.tag;
  argstr = argstr + _tag;
  var _txt = "";
  var _xtra = "";
  var def_extra = " ";
  for (var i = 0; i < ks.length; i++) {
    if (ks[i] == "tag") { }
    else {
      if (ks[i] == "text") { _txt = params["text"]; }
      else if (ks[i] == "extra") { _xtra = params['extra']; }
      else if (ks[i] === "onReady") { SetupAction(params["onReady"]); }
      else if (ks[i] === "def_extra") { def_extra = params['def_extra']; }
      else { argstr = argstr + ' ' + (ks[i] + '="' + params[ks[i]]) + '"'; }
    }
  }
  return argstr + def_extra + ">" + _txt + ((_xtra) ? " " : "") + _xtra + "</" + _tag + ">";
};
var CreateWidget = (_tag, _params) => {
  var ps = _params ? _params : {}; ps.tag = _tag;
  return $(FormatArgStr(ps));
};
module.exports = {
  TextWindow: (params) => CreateWidget("textarea", params),
  Abbreviation: (params) => CreateWidget("abbr", params),
  Address: (params) => CreateWidget("address", params),
  Anchor: (params) => CreateWidget("a", params),
  Bold: (params) => CreateWidget("b", params),
  Button: (params) => CreateWidget("button", params),
  Canvas: (params) => CreateWidget("canvas", params),
  Div: (params) => CreateWidget("div", params),
  Form: (params) => CreateWidget("form", params),
  Fieldset: (params) => CreateWidget("fieldset", params),
  Header: (params) => CreateWidget(params['order'] ? 'h' + params['order'] : 'h1', params),
  HR: (params) => CreateWidget("hr", params),
  IFrame: (params) => CreateWidget("iframe", params),
  Image: (params) => CreateWidget("img", params),
  Input: (params) => CreateWidget("input", params),
  Icon: (params) => CreateWidget("i", params),
  Label: (params) => CreateWidget("label", params),
  ListItem: (params) => CreateWidget("li", params),
  Navbar: (params) => CreateWidget("nav", params),
  Obj: (params) => CreateWidget("object", params),
  Option: (params) => CreateWidget("option", params),
  OrderedList: (params) => CreateWidget("ol", params),
  Paragraph: (params) => CreateWidget("p", params),
  Pre: (params) => CreateWidget("pre", params),
  Script: (params) => CreateWidget("script", params),
  Section: (params) => CreateWidget("section", params),
  Select: (params) => CreateWidget("select", params),
  Separator: () => '<hr/>',
  Span: (params) => CreateWidget("span", params),
  Small: (params) => CreateWidget("small", params),
  Strong: (params) => CreateWidget("strong", params),
  Switcher: (params) => new Switchery(document.querySelector(params.id), { color: params.color }),
  HorizontalRule: (params) => CreateWidget("hr", params),
  Table: (params) => CreateWidget("table", params),
  TableHeader: (params) => CreateWidget("thead", params),
  TableHead: (params) => CreateWidget("th", params),
  TableBody: (params) => CreateWidget("tbody", params),
  TableRow: (params) => CreateWidget("tr", params),
  TableData: (params) => CreateWidget("td", params),
  UnorderedList: (params) => CreateWidget("ul", params),
  Source: (params) => CreateWidget("source", params),
  Video: (params) => CreateWidget("video", params),
  InputAutoComplete: (params) => {
    params.tag = "input";
    params.onReady = () => { $(document).ready(() => { $(`#${params.id}`).autocomplete({ source: params.availableTags }); }); };
    return $(FormatArgStr(params));
  }
};