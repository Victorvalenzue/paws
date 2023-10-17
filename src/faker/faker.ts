import { Faker, LocaleDefinition, fakerES_MX } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';
import { AdoptionStatus, Publication, PublicationType, Video } from 'src/types/publication';
import { ApplicationForm, FormField, FormOption, FormSection, FormType } from 'src/types/form';
import { PetSpecie, PetGender, Pet } from 'src/types/pet';

// Crea una instancia de Faker
const faker = fakerES_MX;
const randomGIFURLs = [faker.internet.url()];

// Define un generador para una mascota (Pet)
const getPet = (): Pet => ({
  idField: faker.string.uuid(),
  bio: faker.lorem.paragraph(),
  breed: faker.lorem.word(),
  color: faker.color.human(),
  ownerId: faker.string.uuid(),
  isAdopted: faker.datatype.boolean(),
  adoptionDate: faker.number.int(),
  species: PetSpecie.CAT,
  gender: PetGender.MALE,
  profileId: faker.lorem.word(),
  profileImageURL: faker.image.avatar(),
  profileName: faker.lorem.word(),
  createdAt: faker.date.past().getTime(),
});

// Define un generador para una publicación de tipo "ADOPTION"
const getAdoption = (): Publication => ({
  idField: faker.string.uuid(),
  title: `${faker.lorem.words(1)} está buscando nueva familia`,
  description: faker.lorem.words(6),
  tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
  createdAt: faker.date.past().getTime(),
  content: {
    images: [faker.image.urlLoremFlickr({ category: 'puppy' })],
    text: faker.lorem.paragraph(),
  },
  adoption: {
    location: faker.location.city(),
    lat: faker.location.latitude({ max: 10, min: -10 }),
    long: faker.location.longitude({ max: 10, min: -10 }),
    age: faker.number.int(),
    pet: getPet(), // Genera una mascota usando el generador 'pet'
    status: AdoptionStatus.IN_PROGRESS,
    applicants: faker.number.int(),
    limit: faker.number.int(),
    endTime: faker.number.int(),
    finishedAt: faker.number.int(),
  },
  type: PublicationType.ADOPTION,
  likes: faker.number.int(),
  profileId: faker.lorem.word(),
  profileImageURL: faker.image.avatar(),
  profileName: faker.lorem.word(),
  verified: true,
});

// Genera una publicación de tipo IMAGE
export const imagePublication = (img: string[]): Publication => ({
  idField: uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  tags: [faker.lorem.word()],
  createdAt: faker.date.past().getTime(),
  content: {
    images: [...img],
    text: faker.lorem.paragraphs(1),
  },
  type: PublicationType.IMAGE,
  likes: faker.number.int(),
  profileId: faker.lorem.word(),
  profileImageURL: faker.image.avatar(),
  profileName: faker.lorem.word(),
  verified: false,
});

// Genera una publicación de tipo VIDEO
export const videoPublication: (vid: Video) => Publication = (vid: Video) => ({
  idField: uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  tags: [faker.lorem.word()],
  createdAt: faker.date.past().getTime(),
  content: {
    video: vid,
    text: faker.lorem.paragraphs(1),
  },
  type: PublicationType.VIDEO,
  likes: faker.number.int(),
  profileId: faker.lorem.word(),
  profileImageURL: faker.image.avatar(),
  profileName: '',
  verified: false,
});

// Genera una publicación de tipo TEXT
export const textPublication: Publication = {
  idField: uuid(),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  tags: [faker.lorem.word()],
  createdAt: faker.date.past().getTime(),
  content: {
    text: faker.lorem.paragraphs(2),
  },
  type: PublicationType.TEXT,
  likes: faker.number.int(),
  profileId: '',
  profileImageURL: faker.image.avatar(),
  profileName: '',
  verified: false,
};

function generateimagePublication() {
  const images = Array.from(
    {
      length: 3,
    },
    () =>
      faker.image.urlLoremFlickr({
        width: 640,
        height: 480,
        category: 'pet',
      }),
  );
  const i = imagePublication(images);
  return i;
}
const numPublications = 5;
function generateVideoPublication() {
  const videos = [
    'https://video-previews.elements.envatousercontent.com/files/33de8dee-9991-4467-8963-7a9bd3240595/video_preview_h264.mp4',
    'https://video-previews.elements.envatousercontent.com/files/e9be1b14-2bc5-45cd-9841-a44e7d39b23d/video_preview_h264.mp4',
    'https://video-previews.elements.envatousercontent.com/7fbeccf4-3bc7-4cbb-940d-632c0003e3ba/watermarked_preview/watermarked_preview.mp4',
    'https://video-previews.elements.envatousercontent.com/files/a3b6db25-f565-4821-bd9c-dd168a12e141/video_preview_h264.mp4',
    'https://video-previews.elements.envatousercontent.com/files/866d8035-b049-422e-b2f7-e7b179c69f73/video_preview_h264.mp4',
  ];
  function getRandomVideoUrl(videos: string[]): string {
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }

  const randomVideoUrl = getRandomVideoUrl(videos);
  const i = videoPublication({
    url: randomVideoUrl,
    poster:
      'https://elements-video-cover-images-0.imgix.net/files/866d8035-b049-422e-b2f7-e7b179c69f73/inline_image_preview.jpg?auto=compress%2Cformat&fit=min&h=281&w=500&s=d783975b5bf616bea02e6a9b81a1c589',
  });
  return i;
}
function generateAdoptionPublication(): Publication {
  const i = getAdoption();
  return i;
}

export function getPublications(): Publication[] {
  const videoPublications: Publication[] = Array.from({ length: numPublications }, generateVideoPublication);
  const imagePublications: Publication[] = Array.from({ length: numPublications }, generateimagePublication);
  const adoptionPublications: Publication[] = Array.from({ length: numPublications }, generateAdoptionPublication);
  const publications: Publication[] = [...videoPublications, ...imagePublications, ...adoptionPublications];

  function comparadorAleatorio() {
    return Math.random() - 0.5; // Esto devuelve un número aleatorio entre -0.5 y 0.5
  }
  publications.sort(comparadorAleatorio);
  console.log('💡 publications::: ', publications);
  return publications;
}

console.log(
  faker.image.urlLoremFlickr({
    width: 200,
    height: 180,
    category: 'pet',
  }),
);
