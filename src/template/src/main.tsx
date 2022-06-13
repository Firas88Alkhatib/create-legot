import { initApp } from "legot";

import "Components/App";

import "global.css";

const root = document.querySelector<HTMLDivElement>("#root")!;

initApp(root, <c-app />);
