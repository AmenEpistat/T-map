import styles from './NotFoundPage.module.scss';
import errorImage from '@/shared/assets/404.svg';

const NotFoundPage = () => {
    return (
        <section className={styles['not-found']}>
            <img
                className={styles['not-found__logo']}
                src={'/tbank_logo.svg'}
                alt='logo t-bank.'
                width='100%'
            />
            <img
                className={styles['not-found__text']}
                src={errorImage}
                alt='404.'
                width='100%'
            />
            <div>
                <h3 className={styles['not-found__title']}>
                    Tакой страницы нет
                </h3>
                <p className={styles['not-found__description']}>
                    Но есть много других полезных страниц
                </p>
            </div>
            <ul className={styles['not-found__links']}>
                <li className={styles['not-found__links-item']}>
                    <a
                        className={styles['not-found__links-link']}
                        href='https://www.tbank.ru/cards/credit-cards/'
                    >
                        Кредитные карты
                    </a>
                </li>
                <li className={styles['not-found__links-item']}>
                    <a
                        className={styles['not-found__links-link']}
                        href='https://www.tbank.ru/cards/debit-cards/'
                    >
                        Дебетовые карты
                    </a>
                </li>
                <li className={styles['not-found__links-item']}>
                    <a
                        className={styles['not-found__links-link']}
                        href='https://www.tbank.ru/deposits/'
                    >
                        Вклады
                    </a>
                </li>
                <li className={styles['not-found__links-item']}>
                    <a
                        className={styles['not-found__links-link']}
                        href='https://www.tbank.ru/mobile-operator/?internal_source=page404'
                    >
                        Сим-карта
                    </a>
                </li>
                <li className={styles['not-found__links-item']}>
                    <a
                        className={styles['not-found__links-link']}
                        href='https://www.tbank.ru/'
                    >
                        tbank.ru
                    </a>
                </li>
            </ul>
        </section>
    );
};

export default NotFoundPage;
