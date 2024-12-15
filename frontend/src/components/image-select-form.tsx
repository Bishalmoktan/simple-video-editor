import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  onChange: ((value: string) => void) | undefined;
};

export default function ImageSelectForm({
  label,
  placeholder,
  options,
  onChange,
}: Props) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option, index) => (
            <SelectItem key={index} value={option} className="capitalize">
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
