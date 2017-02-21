import React from 'react';
import cn from 'classnames';

import ShareExperienceItem from './ShareExperienceItem';
import styles from './ShareExperienceWrapper.module.css';


const ShareExperienceWrapper = () => (
  <section className={cn(styles.share_experience_section, 'wrapper_l')}>
    <h2 className="subtitle">現在就留下裡的資料吧！</h2>
    <div className={styles.share_experience_wrapper}>
      <ShareExperienceItem />
      <ShareExperienceItem />
      <ShareExperienceItem />
    </div>
  </section>
);


export default ShareExperienceWrapper;
