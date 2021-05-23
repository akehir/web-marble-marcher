import { Vector3f } from './vector3f';

export class AngleAxis extends Vector3f {
  constructor() {
    super();

    operator=(const QuaternionBase<QuatDerived>& q)
    {
      Scalar n = q.vec().norm();
      if(n<NumTraits<Scalar>::epsilon())
        n = q.vec().stableNorm();

      if (n != Scalar(0))
      {
        m_angle = Scalar(2)*atan2(n, abs(q.w()));
        if(q.w() < 0)
          n = -n;
        m_axis  = q.vec() / n;
      }
      else
      {
        m_angle = Scalar(0);
        m_axis << Scalar(1), Scalar(0), Scalar(0);
      }
      return *this;
    }
  }

  toRotationMatrix(void) const
{
  const res = new Vector3f();
  const sin_axis  = sin(m_angle) * m_axis;
  Scalar c = cos(m_angle);
  Vector3 cos1_axis = (Scalar(1)-c) * m_axis;

  Scalar tmp;
  tmp = cos1_axis.x() * m_axis.y();
  res.coeffRef(0,1) = tmp - sin_axis.z();
  res.coeffRef(1,0) = tmp + sin_axis.z();

  tmp = cos1_axis.x() * m_axis.z();
  res.coeffRef(0,2) = tmp + sin_axis.y();
  res.coeffRef(2,0) = tmp - sin_axis.y();

  tmp = cos1_axis.y() * m_axis.z();
  res.coeffRef(1,2) = tmp - sin_axis.x();
  res.coeffRef(2,1) = tmp + sin_axis.x();

  res.diagonal() = (cos1_axis.cwiseProduct(m_axis)).array() + c;

  return res;
}
}
