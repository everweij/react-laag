import * as React from "react";

export default React.forwardRef(function Logo(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 212.633 640" ref={svgRef} {...props}>
      <defs>
        <path
          d="M127.59 482.59s-17.16-8.17-20.91-9.21v-.06c-.02-.06-.15-.07-.37-.03-.2-.04-.34-.03-.35.03 0 0-.01.05-.01.06-3.75 1.04-20.91 9.21-20.91 9.21S68.53 640.9 106.31 640c37.79.9 21.28-157.41 21.28-157.41"
          id="prefix__a"
        />
        <path
          d="M87.68 485.44s17.15-8.17 20.9-9.22c0 0 .01-.05.01-.06.02-.06.15-.06.36-.03.21-.03.34-.03.36.03v.06c2.87.8 13.56 5.76 18.45 8.06l-.17-1.69s-17.16-8.17-20.91-9.21v-.06c-.02-.06-.15-.07-.37-.03-.2-.04-.34-.03-.35.03 0 0-.01.05-.01.06-3.75 1.04-20.91 9.21-20.91 9.21S71.37 613.71 97.39 636.6c-22.44-29.21-9.71-151.16-9.71-151.16"
          id="prefix__b"
        />
        <path
          d="M106.64 640H106c-1.77 0-3.42-.36-4.95-1.03.48.05.96.08 1.45.08h.63c21.74 0 25.28-53.3 24.43-97.87 1.15.7 2.32 1.38 3.53 2.06-.42-24.3-2.17-46.16-3.03-55.65h.01c.97 10.83 3.11 37.81 3.11 66.11 0 41.72-4.65 86.31-24.54 86.3"
          id="prefix__c"
        />
        <path
          d="M127.56 541.18c-26.67-16.2-36.94-38.06-40.54-48.69.16-1.91.31-3.47.42-4.64 5.87.49 11.95.71 18.28.74v.01c.2 0 .4-.01.59-.01.2 0 .4.01.6.01v-.01c6.14-.02 12.05-.24 17.76-.7.87 9.91 2.46 30.46 2.89 53.29"
          id="prefix__d"
        />
        <path
          d="M87.02 492.49c-.7-2.06-1.15-3.71-1.42-4.8.61.06 1.22.11 1.84.16-.11 1.17-.26 2.73-.42 4.64"
          id="prefix__e"
        />
        <path
          d="M131.09 543.24c-1.21-.68-2.38-1.36-3.53-2.06-.43-22.83-2.02-43.38-2.89-53.29 1.14-.09 2.27-.19 3.39-.3.86 9.49 2.61 31.35 3.03 55.65"
          id="prefix__f"
        />
        <path
          d="M11.27 454.9c29.29 26.67 57.64 33.54 94.45 33.69v.01c.2 0 .4-.01.59-.01.2 0 .4.01.6.01v-.01c24.47-.1 45.19-3.17 64.94-13.05C74.42 446.98 13.9 377.66.27 365.22c-1.18 45.7 1.36 80.9 11 89.68"
          id="prefix__g"
        />
        <path
          d="M187.52 89.37c-.06-.6-.12-1.19-.18-1.75C181.11 23.59 131.26.01 106.32 0h-.01c-18.97.01-52.37 13.67-70 48.39-5.54 10.93-9.53 23.92-11.02 39.23 0 .03-.03.3-.03.33 32.17 29.7 91.23 76.13 172.41 92.47-4.3-39.43-8.33-72.8-10.15-91.05"
          id="prefix__h"
        />
        <path
          d="M211.42 340.24C107.11 324.21 36.81 257.32 9.75 230.44c-4.5 45.8-8.44 94.39-9.48 134.78 13.63 12.44 74.15 81.76 171.58 110.32 9.97-4.99 19.69-11.69 29.52-20.64 11.33-10.32 12.84-57.17 10.05-114.66"
          id="prefix__i"
        />
        <path
          d="M206.18 265.96c-2.57-29.43-5.6-58.88-8.51-85.54-81.18-16.34-140.24-62.77-172.41-92.47-2.17 22.13-7.96 69-13.45 122.13-.69 6.7-1.38 13.49-2.06 20.36 27.06 26.88 97.36 93.77 201.67 109.8-1.15-23.57-3.02-48.92-5.24-74.28"
          id="prefix__j"
        />
        <path d="M187.29999999999998 87.19000000000001" id="prefix__k" />
        <path
          d="M106.91 488.6c-.2 0-.4-.01-.6-.01-.19 0-.39.01-.59.01v-.01c-6.33-.03-12.41-.25-18.28-.74-.62-.05-1.23-.1-1.84-.16-27.49-2.57-50.6-11.18-74.33-32.79-.18-.17-.36-.36-.54-.54C37.4 475.2 64.06 480.87 97.69 481v.01h1.2V481c21.91-.08 40.87-2.52 58.8-9.98 4.63 1.6 9.35 3.11 14.16 4.52-13.8 6.9-28.08 10.48-43.79 12.05-1.12.11-2.25.21-3.39.3-5.71.46-11.62.68-17.76.7v.01"
          id="prefix__l"
        />
        <path
          d="M197.67 180.42c-1.82-.37-3.63-.75-5.43-1.14-.41-3.76-.81-7.48-1.21-11.14-4.36-40.04-8.45-73.91-10.3-92.43-.07-.62-.12-1.21-.18-1.79-1.13-11.63-3.69-21.94-7.26-31.04 7.06 11.89 12.22 26.53 14.01 44.31.01.07.02.13.02.21.01.08.02.14.02.22.06.56.12 1.15.18 1.75 1.82 18.25 5.85 51.62 10.15 91.05"
          id="prefix__m"
        />
        <path
          d="M171.85 475.54c-4.81-1.41-9.53-2.92-14.16-4.52 2.39-.99 4.77-2.08 7.14-3.26 10.12-5.06 19.98-11.88 29.96-20.96 10.92-9.94 12.86-53.28 10.6-107.55 2 .34 4.01.68 6.03.99.77 15.83 1.21 30.85 1.21 44.53.01 35.99-3.05 62.65-11.26 70.13-9.83 8.95-19.55 15.65-29.52 20.64"
          id="prefix__n"
        />
        <path
          d="M211.42 340.24c-2.02-.31-4.03-.65-6.03-.99-.12-2.92-.25-5.88-.39-8.86-1.17-23.92-3.07-49.66-5.32-75.41-2.26-25.84-4.87-51.68-7.44-75.7 1.8.39 3.61.77 5.43 1.14 2.91 26.66 5.94 56.11 8.51 85.54 2.22 25.36 4.09 50.71 5.24 74.28"
          id="prefix__o"
        />
        <path
          d="M32.12 465.08c-7.25-5.54-11.28-8.62-12.09-9.23-9.1-8.29-11.87-40.16-11.15-82.18 3.25 3.25 7.19 7.13 11.78 11.47-.04 2.83-.05 5.62-.05 8.35 0 36.74 3.12 63.95 11.51 71.59"
          id="prefix__p"
        />
        <path
          d="M44.85 105.03c-4.08-3.35-7.91-6.62-11.48-9.76.25-2.31.46-4.43.65-6.37.01-.03.03-.3.04-.33 1.49-15.31 5.48-28.3 11.02-39.23C62.71 14.62 93.47 6.17 112.44 6.15h.01c1.56 0 3.21.11 4.94.29-1.09-.12-2.13-.18-3.16-.23 1.07.11 2.16.19 3.27.24C97.81 9.99 73.16 19.38 57.7 49.8c-5.66 11.16-9.74 24.43-11.26 40.06 0 .04-.03.31-.03.35-.41 4.14-.94 9.11-1.56 14.82"
          id="prefix__q"
        />
        <path
          d="M20.66 385.14a582.11 582.11 0 01-11.78-11.47c.04-2.46.09-4.97.16-7.5.98-38.35 4.59-84.09 8.8-127.82 3.41 3.28 7.23 6.86 11.45 10.67-4.05 42.79-7.45 87.05-8.41 124.44-.1 3.98-.18 7.87-.22 11.68"
          id="prefix__r"
        />
        <path
          d="M29.29 249.02c-4.22-3.81-8.04-7.39-11.45-10.67.23-2.32.46-4.65.68-6.96.68-6.87 1.36-13.66 2.06-20.36 5.01-48.48 10.26-91.74 12.79-115.76 3.57 3.14 7.4 6.41 11.48 9.76-2.81 25.52-7.6 65.6-12.18 109.94a4049.902 4049.902 0 00-3.38 34.05"
          id="prefix__s"
        />
        <path
          d="M117.5 6.45c-.04 0-.07 0-.11-.01.04.01.07.01.11.01"
          id="prefix__t"
        />
        <path
          d="M32.12 465.08c-8.39-7.64-11.51-34.85-11.51-71.59 0-2.73.01-5.52.05-8.35 3.51 3.33 7.41 6.92 11.68 10.71-.91 21.83-1.04 44.89-.22 69.23"
          id="prefix__u"
        />
        <path
          d="M95.37 140.55c-19.66-11.61-36.56-24.04-50.52-35.52.62-5.71 1.15-10.68 1.56-14.82 0-.04.03-.31.03-.35 1.52-15.63 5.6-28.9 11.26-40.06C73.16 19.38 97.81 9.99 117.5 6.45c0 0 31.49 10.48 49.03 44.6v.01h-.01c-.01 0-.01.01-.02.01 0 0-.01 0-.01.02h-.01c-.02.01-.04.02-.07.05h-.01c-2.33 1.66-37.29 27.24-71.03 89.41"
          id="prefix__v"
        />
        <path
          d="M32.34 395.85c-4.27-3.79-8.17-7.38-11.68-10.71.04-3.81.12-7.7.22-11.68.96-37.39 4.36-81.65 8.41-124.44 5.87 5.28 12.51 11.01 19.91 16.93-8.61 37.4-14.78 80.49-16.86 129.9"
          id="prefix__w"
        />
        <path
          d="M49.2 265.95c-7.4-5.92-14.04-11.65-19.91-16.93a4001.401 4001.401 0 013.38-34.05c4.58-44.34 9.37-84.42 12.18-109.94 13.96 11.48 30.86 23.91 50.52 35.52-17.21 31.72-34.1 72.96-46.17 125.4"
          id="prefix__x"
        />
        <path d="M117.39 6.44" id="prefix__y" />
        <path
          d="M117.5 6.45a57.1 57.1 0 01-3.27-.24c1.03.05 2.07.11 3.16.23.04.01.07.01.11.01"
          id="prefix__z"
        />
        <path
          d="M31.91 458.22c-.58-21.83-.4-42.59.44-62.37 3.29 2.92 6.79 5.94 10.53 9.05-6.51 22.15-10.57 40.68-10.97 53.32"
          id="prefix__A"
        />
        <path
          d="M137.95 161.99c-15.37-6.44-29.57-13.76-42.58-21.44C129.1 78.4 164.06 52.8 166.4 51.14h.01c.03-.03.05-.04.07-.05h.01c0-.02.01-.02.01-.02.01 0 .01-.01.02-.01h.01v-.01s7.01 22.12 7.01 32.23c0 0-15.17 32.46-35.59 78.71"
          id="prefix__B"
        />
        <path
          d="M42.88 404.9c-3.74-3.11-7.24-6.13-10.53-9.05 2.08-49.4 8.24-92.51 16.85-129.9 10.1 8.09 21.61 16.54 34.47 24.78-16.34 41.1-31.22 81.56-40.79 114.17"
          id="prefix__C"
        />
        <path
          d="M83.67 290.73c-12.86-8.24-24.37-16.69-34.47-24.78 12.07-52.44 28.96-93.68 46.17-125.4 13.01 7.68 27.21 15 42.58 21.44-16.43 37.22-36.24 83.36-54.28 128.74"
          id="prefix__D"
        />
        <path
          d="M166.4 51.14h.01-.01m.08-.05h0m.01 0c0-.02.01-.02.01-.02s-.01 0-.01.02m.03-.03h.01-.01m.01-.01"
          id="prefix__E"
        />
      </defs>
      <use xlinkHref="#prefix__a" fill="#f9b266" />
      <use
        xlinkHref="#prefix__a"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__b" fill="#fbd1a9" />
      <use
        xlinkHref="#prefix__b"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__c" fill="#ce753f" />
      <use
        xlinkHref="#prefix__c"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__d" fill="#ce753f" />
      <use
        xlinkHref="#prefix__d"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__e" fill="#cd8964" />
      <use
        xlinkHref="#prefix__e"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__f" fill="#a74c29" />
      <use
        xlinkHref="#prefix__f"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__g" fill="#f47285" />
      <use
        xlinkHref="#prefix__g"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__h" fill="#d2ea78" />
      <use
        xlinkHref="#prefix__h"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__i" fill="#91d9b9" />
      <use
        xlinkHref="#prefix__i"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__j" fill="#fde4a7" />
      <use
        xlinkHref="#prefix__j"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__k" fill="#cf9081" />
      <use
        xlinkHref="#prefix__k"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__l" fill="#d65059" />
      <use
        xlinkHref="#prefix__l"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__m" fill="#b5aa51" />
      <use
        xlinkHref="#prefix__m"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__n" fill="#789e7f" />
      <use
        xlinkHref="#prefix__n"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__o" fill="#dda46e" />
      <use
        xlinkHref="#prefix__o"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <use xlinkHref="#prefix__p" fill="#f9b2bd" />
      <use
        xlinkHref="#prefix__p"
        fillOpacity={0}
        stroke="#000"
        strokeOpacity={0}
      />
      <g>
        <use xlinkHref="#prefix__q" fill="#e6f3b5" />
        <use
          xlinkHref="#prefix__q"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__r" fill="#c5ebd9" />
        <use
          xlinkHref="#prefix__r"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__s" fill="#fef3d2" />
        <use
          xlinkHref="#prefix__s"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__t" fill="#e6f3b5" />
        <use
          xlinkHref="#prefix__t"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__u" fill="#f78d9e" />
        <use
          xlinkHref="#prefix__u"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__v" fill="#dbee93" />
        <use
          xlinkHref="#prefix__v"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__w" fill="#a8e1c7" />
        <use
          xlinkHref="#prefix__w"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__x" fill="#fdeaba" />
        <use
          xlinkHref="#prefix__x"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__y" fill="#d6ec86" />
        <use
          xlinkHref="#prefix__y"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__z" fill="#eaf5bd" />
        <use
          xlinkHref="#prefix__z"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__A" fill="#f58092" />
        <use
          xlinkHref="#prefix__A"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__B" fill="#d6ec86" />
        <use
          xlinkHref="#prefix__B"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__C" fill="#9cdcbf" />
        <use
          xlinkHref="#prefix__C"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__D" fill="#fde8b1" />
        <use
          xlinkHref="#prefix__D"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
      <g>
        <use xlinkHref="#prefix__E" fill="#def09e" />
        <use
          xlinkHref="#prefix__E"
          fillOpacity={0}
          stroke="#000"
          strokeOpacity={0}
        />
      </g>
    </svg>
  );
});
