import {Alert} from "@mui/material";
import BaseLayout from "qqq/layouts/BaseLayout";


interface Props
{
   foo: string;
}

NoApps.defaultProps = {
   foo: null,
};

function NoApps({foo}: Props): JSX.Element
{
   return (
      <BaseLayout>
         <Alert color="error">You do not have permission to access any apps.</Alert>
      </BaseLayout>
   );
}

export default NoApps;
