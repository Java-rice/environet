import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Tailored brand button styles using custom color palette
const buttonVariants = cva(
  // base shared styles
  "px-4 py-2 border rounded text-sm cursor-pointer font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // ✅ Brand and utility variants
        default:
          "bg-[#4CAF50] text-white hover:bg-[#43A047] border-transparent", // Leaf Green
        outline:
          "bg-transparent border-[#4CAF50] text-[#4CAF50] hover:bg-[#E8F5E9]",
        blue: "bg-[#81D4FA] text-[#424242] hover:bg-[#4FC3F7] border-transparent", // Sky Blue
        red: "bg-[#EF5350] text-white hover:bg-[#E53935] border-transparent", // Soft Red
        yellow:
          "bg-[#FFCA28] text-[#424242] hover:bg-[#FFB300] border-transparent", // Amber Yellow
        charcoal: "bg-[#424242] text-white hover:bg-[#333] border-transparent", // Charcoal
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Type for variants using `cva` utility
type ButtonVariantProps = VariantProps<typeof buttonVariants>;

// Props for Button component
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  className?: string;
}

// Reusable Button component
const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={[buttonVariants({ variant, size }), className].join(" ")}
      {...props}
    />
  );
};

export { Button, buttonVariants };
