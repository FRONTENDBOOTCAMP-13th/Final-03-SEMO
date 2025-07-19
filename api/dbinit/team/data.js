import dayjs from "dayjs";

function getTime(day = 0, second = 0) {
  return dayjs().add(day, "days").add(second, "seconds").format("YYYY.MM.DD HH:mm:ss");
}

export const initData = async (clientId, nextSeq) => {
  return {
    // 회원
    user: [
      {
        _id: await nextSeq("user"),
        email: "admin@market.com",
        password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
        name: "무지",
        phone: "01011112222",
        address: "서울시 강남구 역삼동 123",
        type: "admin",
        loginType: "email",
        image: `files/${clientId}/user-muzi.png`,
        createdAt: getTime(-100, -60 * 60 * 3),
        updatedAt: getTime(-100, -60 * 60 * 3),
        extra: {
          birthday: "03-23",
        },
      },
      {
        _id: await nextSeq("user"),
        email: "s1@market.com",
        password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
        name: "네오",
        phone: "01022223333",
        address: "서울시 강남구 삼성동 456",
        type: "seller",
        loginType: "email",
        image: `files/${clientId}/user-neo.png`,
        createdAt: getTime(-50),
        updatedAt: getTime(-30, -60 * 60 * 3),
        extra: {
          birthday: "11-23",
        },
      },
    ],

    // 상품
    product: [],

    // 주문
    order: [],

    // 후기
    review: [],

    // 장바구니
    cart: [],

    // 즐겨찾기/북마크
    bookmark: [],

    // QnA, 공지사항 등의 게시판
    post: [
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 1,
        user: {
          _id: 1,
          name: "hunjin",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "인하공전 행복관",
        },
        title: "황금올리브 팔아요",
        content: "아 싸다 싸 황금올리브 단돈 53,000원",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "53000",
          location: "인하공전 기숙사 지하 1층",
          crt: "판매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "buy",
        views: 2,
        user: {
          _id: 1,
          name: "밥슌",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "숭실대 생활관",
        },
        title: "신라면 한 박스",
        content: "신라면 기부 해주세요ㅠㅠㅠㅠ",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "3000",
          location: "숭실대 생활관 로비",
          crt: "구메중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 3,
        user: {
          _id: 3,
          name: "한솔",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "단국대 행복관",
        },
        title: "에어팟 꼬다리 팔아요",
        content: "본체는 잃어버림",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "50000",
          location: "단국대 행복관 헬스장 앞",
          crt: "판매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "buy",
        views: 1,
        user: {
          _id: 4,
          name: "경민",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "경희대 르네상스관",
        },
        title: "햇반 한 박스",
        content: "햇반 한 박스 삽니당",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "53000",
          location: "경희대 르네상스홀 1층 로비",
          crt: "구매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 1,
        user: {
          _id: 5,
          name: "서현",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "SK 기숙사",
        },
        title: "몽실이 간식",
        content: "몽실이가 안 먹어서 팔아요....",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "3500",
          location: "SK 기숙사 1층 로비",
          crt: "판매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "buy",
        views: 1,
        user: {
          _id: 6,
          name: "선영",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "부산대 행복관",
        },
        title: "대선 1병",
        content: "소주 너무 마려운데 1병만 팔아주세요",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "1800",
          location: "부산대 기숙사 지하 1층",
          crt: "구매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 1,
        user: {
          _id: 7,
          name: "연호",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "동아대 헹복관",
        },
        title: "가오",
        content: "부산 싸나이 가오 팝니다.",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "100000000",
          location: "동아대 기숙사 지하 1층",
          crt: "판매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "buy",
        views: 1,
        user: {
          _id: 8,
          name: "승균",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "동국대 헹복관",
        },
        title: "고릴라 티셔츠",
        content: "고릴라 티셔츠 팔아주세요",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "5000",
          location: "동국대 기숙사 지하 1층",
          crt: "구매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 1,
        user: {
          _id: 1,
          name: "호정",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "서울대 기숙사",
        },
        title: "선글라스",
        content: "아 싸다 싸 선글라스 단돈 53,000원",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "53000",
          location: "서울대 기숙사 지하 1층",
          crt: "판매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "buy",
        views: 1,
        user: {
          _id: 10,
          name: "훈진",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "인하공전 헹복관",
        },
        title: "컵밥 사요",
        content: "너무 배고파요 컵밥 아무거나 사고 싶어요",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "3000",
          location: "인하공전 기숙사 지하 1층",
          crt: "구매중", // 현재 상태
        },
      },
      {
        _id: await nextSeq("post"),
        type: "sell",
        views: 1,
        user: {
          _id: 20,
          name: "테토남경민",
          image: `/files/${clientId}/user-neo.png`,
          dormitory: "멋사 3조 헹복관",
        },
        title: "흠냐링",
        content: "흠냐링 너무 배고파요 밥 사주세요",
        like: 5,
        createdAt: getTime(-2, -60 * 60 * 20),
        updatedAt: getTime(-2, -60 * 60 * 2),
        extra: {
          price: "3000",
          location: "멋사 기숙사 지하 1층",
          crt: "구매중", // 현재 상태
        },
      },
    ],

    // 코드
    code: [],

    // 설정
    config: [],
  };
};
