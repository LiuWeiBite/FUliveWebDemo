import { useUA } from "@/utils/hooks";
import { DownFill } from "antd-mobile-icons";
import { useMemo, useState } from "react";
import styles from "./index.module.less";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import message from "antd/es/message";
import CnIcon from "@/assets/mobIcons/CnIcon.png";
import EnIcon from "@/assets/mobIcons/EnIcon.png";
import { Popover } from "antd";
import { Popover as MobPopover } from "antd-mobile";
import { OptItem, Options } from "@/common/global";

const langIcons: Partial<Record<OptItem["key"], string>> = {
  zh: CnIcon,
  en: EnIcon,
};

const renderMobileLang = (item: OptItem) => {
  const icon = langIcons[item.key];
  if (icon) {
    return <img src={icon} alt="" />;
  }
  return <span className={styles.mobileLabel}>{item.mobileLabel}</span>;
};

export const LangSwitch: React.FC = () => {
  const { i18n, t } = useTranslation();
  const lg = useMemo(
    () => Options.find((item) => item.key === i18n.language) ?? Options[0],
    [i18n.language],
  );
  const { isPc } = useUA();
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = async (k: string) => {
    await i18n.changeLanguage(k);
    message.success(t("语言切换成功"));
    setOpen(false);
  };

  const Comp = useMemo(() => {
    return isPc ? Popover : MobPopover;
  }, [isPc]);

  const popProps = useMemo(() => {
    return isPc
      ? {
          open: open,
          onOpenChange: setOpen,
        }
      : { onVisibleChange: setOpen, visible: open };
  }, [isPc, open]);

  return (
    <Comp
      // @ts-ignore
      trigger={isPc ? "hover" : "click"}
      {...popProps}
      // @ts-ignore
      placement={isPc ? "bottomRight" : "bottom-end"}
      className={`lang-switch-opts ${!isPc && "mobOpts"}`}
      mode={!isPc ? "dark" : undefined}
      content={
        <div className={isPc ? styles.pcOpt : styles.mobileOpt}>
          {Options.map((item, index) => (
            <div
              key={index}
              className={classnames(
                styles.langOpt,
                item.key === lg?.key && styles.active,
              )}
              onClick={() => {
                handleClick(item.key);
              }}
            >
              {isPc ? item?.pcLabel : renderMobileLang(item)}
            </div>
          ))}
        </div>
      }
    >
      <div
        className={classnames(styles.lgBtn, isPc ? styles.pc : styles.mobile)}
      >
        {isPc ? (
          <span className={styles.text}>{lg?.pcLabel}</span>
        ) : (
          renderMobileLang(lg)
        )}
        {isPc && <DownFill className={open && styles.open} />}
      </div>
    </Comp>
  );
};
