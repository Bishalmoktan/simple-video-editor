import { cn } from "@/lib/utils";

const AddVideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="48"
    height="48"
    fill="none"
    viewBox="0 0 48 48"
    className={cn(props.className)}
  >
    <path
      fill="url(#pattern0_11_587)"
      d="M0 0h46.627v46.627H0z"
      transform="translate(.531 .91)"
    ></path>
    <defs>
      <pattern
        id="pattern0_11_587"
        width="1"
        height="1"
        patternContentUnits="objectBoundingBox"
      >
        <use xlinkHref="#image0_11_587" transform="scale(.01042)"></use>
      </pattern>
      <image
        xlinkHref="data:image/png;base64,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"
        id="image0_11_587"
        width="96"
        height="96"
      ></image>
    </defs>
  </svg>
);

export default AddVideoIcon;
