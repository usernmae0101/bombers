import React from "react";
import { useSelector } from "react-redux";

import styles from "./profile-banner.module.scss";
import * as Shared from "@bombers/shared/src/idnex";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";

const ProfileBanner: React.FC<{
    nickname: string;
    localUserNickname: string;
}> = ({ nickname, localUserNickname }) => {
    const rating = useSelector(ProfileSelectors.select_profile_data_rating);
    const place = useSelector(ProfileSelectors.select_profile_data_place);
    const avatar = useSelector(ProfileSelectors.select_profile_data_avatar);
    const lastSeen = useSelector(ProfileSelectors.select_profile_data_last_seen);
    const createdAt = useSelector(ProfileSelectors.select_profile_data_created_at);
    const isOnline = useSelector(ProfileSelectors.select_profile_data_is_online);
    const isLocalProfile = localUserNickname === nickname;

    return (
        <div className={styles.banner}>
            <div className={styles.bar}>
                <div className={styles.nickname}>
                    {nickname}
                </div>

                <div className={styles.online}>
                    <div className={isOnline || isLocalProfile ? styles.on : styles.off}>
                        &nbsp;
                    </div>

                    <div className={styles.seen}>
                        { 
                            isOnline || isLocalProfile ? 
                                "Online" : 
                                `был(а) в сети ${Shared.Helpers.parseDateFromTimestamp(lastSeen)}`
                        }
                    </div>
                </div>
            </div>

            <div className={styles.board}>
                <div className={styles.avatar}>
                    <img src={avatar} />
                </div>

                <div className={styles.info}>
                    <div>зарегистрирован: {Shared.Helpers.parsePeriodFromTimestamp(createdAt)}</div>
                    <div>рейтинг: {rating}</div>
                    <div>место: {place}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBanner;
