"use client";

import dynamic from "next/dynamic";

const DesignedQuinielaApp = dynamic(() => import("./DesignedQuinielaApp"), {
  ssr: false,
});

export default function ClientOnlyQuiniela() {
  return <DesignedQuinielaApp />;
}
