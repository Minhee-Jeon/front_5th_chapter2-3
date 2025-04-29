const get = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('데이터 조회 오류:', error);
  }
};

const post = async (url: string, data: unknown) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('데이터 추가 오류:', error);
  }
};

const put = async (url: string, data: unknown) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('데이터 수정 오류:', error);
  }
};

// delete 예약어로 인해 remove로 명명함
const remove = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error('데이터 삭제 오류:', error);
  }
};

const patch = async (url: string, data: unknown) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('데이터 수정 오류:', error);
  }
};

export { get, patch, post, put, remove };
