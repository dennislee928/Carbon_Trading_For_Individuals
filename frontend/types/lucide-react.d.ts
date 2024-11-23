declare module "lucide-react" {
  import { FC, SVGProps } from "react";

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export const Search: FC<IconProps>;
  export const ArrowRight: FC<IconProps>;
  export const CreditCard: FC<IconProps>;
  export const Database: FC<IconProps>;
  // Add other icons you need
}
