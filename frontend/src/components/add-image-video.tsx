type Props = {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
};

export default function AddImageVideo({ icon: Icon, className, title }: Props) {
  return (
    <div
      className={`flex flex-col rounded-lg  w-[220px] h-[125px] justify-center items-center space-x-2 ${className} shadow-[0_0_7.77px_rgba(220,240,255,0.25)]`}
    >
      <Icon className="size-10" />
      <span>{title}</span>
    </div>
  );
}
