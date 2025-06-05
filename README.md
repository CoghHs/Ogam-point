# 🧘‍♀️ 오감요가 적립금 시스템

> **요가 회원의 포인트를 관리하는 관리자용 웹 애플리케이션입니다.**  
> 회원의 적립/차감 내역을 효율적으로 조회하고, 포인트 만료일을 기준으로 자동 만료 처리까지 지원합니다.

---

## 🎯 기획 의도

이 프로젝트는 **요가 회원 관리의 효율성을 높이기 위한 필요에서 시작되었습니다.**  
재등록 시 지급되는 적립금, 1년 후 자동 소멸 기능, 적립/차감 내역 추적 등  
운영자가 **일일이 수작업으로 처리해야 했던 업무를 간편하고 정확하게 관리할 수 있도록** 설계되었습니다.

기존에는 회원의 적립금을 수기로 관리하고, 만료일이나 차감 이력을 별도로 기록해야 하는 번거로움이 있었지만  
이 시스템을 통해 **회원별 적립금 이력을 자동으로 관리**하고,  
**UI를 통해 직관적으로 적립/차감/만료 처리를 수행할 수 있도록 개선**했습니다.

향후에는 단순한 적립금 관리 도구를 넘어,  
회원별 메모 작성, 건강 상태 기록, 수강 이력 등 다양한 데이터를 함께 관리할 수 있는  
**통합 관리자 플랫폼**으로 발전시켜 나갈 계획입니다.

---

## ⚙️ 사용 기술 스택

| 분야                  | 기술                                          |
| --------------------- | --------------------------------------------- |
| **Frontend**          | Next.js 15 (App Router), React 19, TypeScript |
| **Styling**           | Tailwind CSS, tailwind-merge, clsx            |
| **State Management**  | Zustand, React Query v5                       |
| **Form & Validation** | React Hook Form, Zod                          |
| **Animation**         | Motion                                        |
| **Database**          | Prisma (PostgreSQL)                           |
| **기타**              | Headless UI, Lucide Icons, Commitizen         |

---

## 📌 주요 기능

- 회원 목록 조회 및 검색
- 회원 등록 및 수정
- 포인트 **적립 / 차감 / 만료** 관리
- 상세 모달을 통한 회원 이력 확인 및 액션 수행
- 만료 포인트 시각적 구분
- 반응형 UI 및 접근성 고려

---

## 🎥 기능 시연 (GIF)

### ➕ 회원 등록

![회원 등록](https://github.com/user-attachments/assets/eb0ef33b-40fb-41e5-ad8d-ea5f558c7639)

### 🧾 적립금 등록 및 차감

![적립 및 차감](https://github.com/user-attachments/assets/b63c1e5e-ffe4-47b5-a3e0-4bc53566b0df)

### 🧹 적립금 히스토리 삭제

![히스토리 삭제](https://github.com/user-attachments/assets/8db8219e-95b2-4ac3-ba56-bfb4149e6a1d)

### 🗑️ 회원 삭제

![회원 삭제](https://github.com/user-attachments/assets/8e0d6541-5fb8-4d3d-b50c-4108b854c9f0)

### 🔚 만료된 적립금 시각화

<img src="https://github.com/user-attachments/assets/a6230411-5a8a-4ee5-b618-a2e4e1afcc4f" width="800" />

### 📱 반응형 시연

![반응형 시연](https://github.com/user-attachments/assets/9b3fbb6e-4cb0-47cf-bcb1-c970c58b5ab8)

---

## ⚒️ 트러블슈팅 (문제 해결)

### 1. 포인트 만료 처리 시, 총 적립금에서 같이 차감되는 문제

- **문제**: 만료 처리 시 `총 적립금(totalPoint)`에서도 금액이 빠지는 문제가 발생
- **해결**:
  - `totalPoint`는 실제 사용된 포인트만 반영하고, 만료된 포인트는 별도 처리
  - 내역에 `isExpired` 값을 저장해 만료 항목을 회색으로 시각화

### 2. 포인트 내역이 실시간 반영되지 않던 문제

- **문제**: 적립/차감 후에도 내역 리스트가 자동으로 갱신되지 않음
- **해결**: React Query의 `invalidateQueries` 및 `queryKey` 전략 수정으로 자동 새로고침 구현

### 3. Prisma 마이그레이션 충돌 문제

- **문제**: `dev` 환경과 `build` 환경에서 마이그레이션 방식이 달라 오류 발생
- **해결**: `build` 스크립트에 `prisma generate && prisma migrate deploy`를 추가해 해결

---

## 🔮 향후 개발 계획

- 회원별 메모 기능 (예: 몸 상태, 통증 위치, 개별 요청사항 등)
- 수강 이력 및 방문 기록 관리
- 관리자 계정별 권한 부여 (예: 원장, 강사 등)

---

## 🧪 실행 방법

```bash
# 로컬에서 실행
npm install
npx prisma migrate dev
npm run dev
```
