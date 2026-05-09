import { CompanyDetail } from "./CompanyDetail";
import { IndustryDetail } from "./IndustryDetail";

export function DetailPanel(props) {
  if (props.node.type === "company") return <CompanyDetail {...props} />;
  return <IndustryDetail node={props.node} model={props.model} />;
}
