import { ReactNode, memo } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
};

const Card = memo(function Card({ title, children, actions }: CardProps) {
  return (
    <div className="card">
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__body">{children}</div>
      {actions && <div className="card__actions">{actions}</div>}
    </div>
  );
});

export default Card;
