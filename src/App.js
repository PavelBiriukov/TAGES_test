//Добавил отслеживание ошибок надеюсь оцените :) 

const fetchData = async (url) => {//Функцыя для запроса и получения данных 
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching data:', error);
  }
};

const postsWithComments = async (posts) => { //Функцыя для  добавления коментариев 
  const enrichedPosts = await Promise.all(posts.map(async (post) => {
    const commentsUrl = `http://jsonplaceholder.typicode.com/posts/${post.id}/comments`;
    const comments = await fetchData(commentsUrl)
    post.comments = comments;
    return post
  }))
  return enrichedPosts
}

const generateUserArray = async () => { // Функцыя генерации users и posts
  try {
    const posts = await fetchData('http://jsonplaceholder.typicode.com/posts');
    const users = await fetchData('http://jsonplaceholder.typicode.com/users');

    if (!users || !Array.isArray(users) || users.length === 0) {
      throw new Error('Unable to fetch users data.');
    }

    const limitedUsers = users.slice(0, 10);
    const formattedUsers = await Promise.all(limitedUsers.map(async (user) => {
      const userPosts = posts.filter(post => post.userId === user.id);
      const enrichedPosts = await postsWithComments(userPosts);
      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
        website: `https://${user.website}`,
        company: user.company.name,
        posts: user.name === 'Ervin Howell' ? //Если Ervin Howell то добавляем комментарии к посту если нет то нет. 
          enrichedPosts.map(post => ({
            comments: post.comments,
            id: post.id,
            title: post.title,
            title_crop: post.title.slice(0, 20) + '...', //сокращение title_crop до 20 символов
            body: post.body
          })) :
          enrichedPosts.map(post => ({
            id: post.id,
            title: post.title,
            title_crop: post.title.slice(0, 20) + '...',
            body: post.body
          }))
      };
      return formattedUser;
    }));

    console.log(formattedUsers);
  } catch (error) {
    console.error(error);
  }
};

generateUserArray();

const App = () => {
  return (
    <div>
      <h1>
        Тестовое задание на вакансию JavaScript разработчи компания TAGES
      </h1>
    </div>
  );
};

export default App;