// CustomLoader.tsx
import { forwardRef } from "react";
import { Image, MantineLoaderComponent } from "@mantine/core";
import classes from "./CustomLoader.module.css";

export const CustomLoader: MantineLoaderComponent = forwardRef(
  ({ ...others }, ref) => (
    <Image
      src="/galaxia_glamour.png"
      alt="Galaxia Glamour Logo"
      className={classes.imageLoader}
      {...others}
      ref={ref}
    />
  )
);
