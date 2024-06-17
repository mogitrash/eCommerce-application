import BaseComponent from '../base/base.component';
import './about-us.scss';
import HermanPhoto from '../../assets/images/herman.jpg';
import AliaksandraPhoto from '../../assets/images/aliaksandra.jpg';
import KanstantsinPhoto from '../../assets/images/kanstantsin.jpg';
import SchoolLogo from '../../assets/images/logo-rsschool.png';

type Member = {
  fullName: string;
  photo: string;
  bio: string;
  contributions: string[];
  github: string;
};

const TEAM: Member[] = [
  {
    fullName: 'Herman Vasilkouski',
    photo: HermanPhoto,
    bio: "I'm a Belarusian State University of Informatics and Radioelectronics (BSUIR) student pursuing a future degree in Software Engineering and Game Design. I come from Mogilev, where I graduated from the BRU Lyceum. I have been passionate about IT technologies since childhood and have participated in computer science olympiads.",
    contributions: ['Team Lead', 'Development of Data Access Layer'],
    github: 'https://github.com/mogitrash',
  },
  {
    fullName: 'Aliaksandra Rahachova',
    photo: AliaksandraPhoto,
    bio: "Chemical engineer from Grodno with a love for hiking, yoga, and all things outdoors. Currently leveling up my coding skills as an RSS student, aiming to blend chemistry with cutting-edge tech. I'm looking forward to future projects.",
    contributions: [
      'Development of Authorisation and Registration Form',
      'Marketplace Content Management with Automation Scripts',
    ],
    github: 'https://github.com/rahachova',
  },
  {
    fullName: 'Kanstantsin Davydovich',
    photo: KanstantsinPhoto,
    bio: 'I graduated from BSUIR with a specialization in multi-channel telecommunications systems and currently work as an engineer anykey. I love the forest, the fire, and playing the guitar — preferably all together. Now, with the help of RS School, I am becoming a front-end developer.',
    contributions: ['Routing Implementation', 'Product Page Implementation', ' Project Deployment'],
    github: 'https://github.com/constantineigorevich',
  },
];

export default class AboutUsComponent extends BaseComponent<'div'> {
  constructor() {
    super({ tag: 'div', classes: ['about-us'] });

    this.render();
  }

  private static createTeamMemberInfo(member: Member): BaseComponent<'div'> {
    const memberContainer = new BaseComponent({ tag: 'div', classes: ['member_container'] });
    const memberPhoto = new BaseComponent({ tag: 'img', classes: ['member_image'] });
    memberPhoto.setAttribute('src', member.photo);
    const memberDescriptionContainer = new BaseComponent({
      tag: 'div',
      classes: ['member_description-container'],
    });
    const memberName = new BaseComponent({
      tag: 'div',
      classes: ['member_name'],
      textContent: member.fullName,
    });
    const memberBio = AboutUsComponent.createMemberInfoItem('Bio:', member.bio);
    const memberContributions = AboutUsComponent.createMemberContributions(
      'Key Contributions:',
      member.contributions,
    );
    const memberGithubLink = new BaseComponent({
      tag: 'a',
      classes: ['member_description'],
      textContent: 'GitHub link',
    });
    memberGithubLink.setAttribute('href', member.github);

    memberGithubLink.setAttribute('target', '_blank');
    memberDescriptionContainer.append([
      memberName,
      memberBio,
      memberContributions,
      memberGithubLink,
    ]);
    memberContainer.append([memberPhoto, memberDescriptionContainer]);
    return memberContainer;
  }

  private static createMemberInfoItem(title: string, value: string): BaseComponent<'div'> {
    const infoContainer = new BaseComponent({
      tag: 'div',
      classes: ['member_info-item'],
    });
    const infoTitle = new BaseComponent({
      tag: 'p',
      classes: ['member_title'],
      textContent: title,
    });
    const infoValue = new BaseComponent({
      tag: 'p',
      classes: ['member_value'],
      textContent: value,
    });
    infoContainer.append([infoTitle, infoValue]);
    return infoContainer;
  }

  private static createMemberContributions(
    title: string,
    contributions: string[],
  ): BaseComponent<'div'> {
    const contributionsContainer = new BaseComponent({
      tag: 'div',
      classes: ['member_info-item'],
    });
    const contributionsTitle = new BaseComponent({
      tag: 'p',
      classes: ['member_title'],
      textContent: title,
    });
    const list = new BaseComponent({ tag: 'ul', classes: ['member_list'] });
    list.append(
      contributions.map((contribution) => {
        return new BaseComponent({
          tag: 'li',
          classes: ['member_list-item'],
          textContent: contribution,
        });
      }),
    );
    contributionsContainer.append([contributionsTitle, list]);
    return contributionsContainer;
  }

  private static createSchoolLink() {
    const schoolLink = new BaseComponent({ tag: 'a', classes: ['school-link'] });
    schoolLink.setAttribute('href', 'https://rs.school/');
    schoolLink.setAttribute('target', '_blank');
    const schoolLogo = new BaseComponent({ tag: 'img', classes: ['school-logo'] });
    schoolLogo.setAttribute('src', SchoolLogo);
    schoolLink.append([schoolLogo]);
    return schoolLink;
  }

  render() {
    this.append([AboutUsComponent.createSchoolLink()]);
    this.append(TEAM.map(AboutUsComponent.createTeamMemberInfo));
  }
}
