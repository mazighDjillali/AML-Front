import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type Mode = "numbers" | "risk"

interface ModeDropdownProps {
  mode: Mode
  onSelect: (value: string | number) => void
}

export function NumberDropdown({ mode, onSelect }: ModeDropdownProps) {
  const [selected, setSelected] = useState<string | number | null>(null)

  const handleSelect = (value: string | number) => {
    setSelected(value)
    onSelect(value)
  }

  const items =
    mode === "numbers"
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : ["ALL", "High", "Medium", "Low"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-36">
          {selected !== null ? `${selected}` : "Select"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 max-h-32 overflow-y-auto">
        {items.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => handleSelect(item)}
            className="cursor-pointer capitalize"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
