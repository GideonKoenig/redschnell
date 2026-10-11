import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

/** Profile picture that falls back to the first two letters of the name. */
export function UserAvatar(props: {
    name: string | null;
    image: string | null | undefined;
    className?: string;
}) {
    const initials = props.name
        ? props.name.charAt(0).toUpperCase() +
          props.name.charAt(1).toLowerCase()
        : "?";

    return (
        <Avatar className={cn("size-6", props.className)}>
            <AvatarImage src={props.image ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
    );
}
