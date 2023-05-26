import utils from "@rus-anonym/web-utils";
import { Avatar as NativeAvatar } from "@vkontakte/vkui";
import { InitialsAvatarNumberGradients } from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import { useMemo, useState } from "react";

export const Avatar = ({
    badge,
    src,
    placeholder,
    size = 48
}: {
  badge?: JSX.Element;
  placeholder: string;
  src: string | null;
  size?: number;
}) => {
    const [isLoad, setIsLoad] = useState(true);

    const placeholderAvatar = useMemo(() => {
        const title = placeholder
            .split(" ")
            .map((x) => x[0])
            .slice(0, 2)
            .join("");

        return (
            <NativeAvatar
                size={size}
                gradientColor={
                    utils.number.getRandomInt(
                        1,
                        7,
                        placeholder
                    ) as InitialsAvatarNumberGradients
                }
            >
                {title}
            </NativeAvatar>
        );
    }, []);

    if (src === null) {
        return placeholderAvatar;
    }

    return (
        <>
            {isLoad && placeholderAvatar}
            <NativeAvatar
                size={size}
                src={src}
                style={{
                    display: isLoad ? "none" : undefined 
                }}
                onLoad={() => setIsLoad(false)}
            >
                {badge}
            </NativeAvatar>
        </>
    );
};
