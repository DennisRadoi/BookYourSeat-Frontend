-- Schema bazei de date pentru aplicatia Office Seat Booking
-- Realizata dupa user story-urile din ClickUp si dupa diagrama existenta.

CREATE TABLE judet (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE localitate (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL,
  cod_judet INT NOT NULL,

  CONSTRAINT fk_localitate_judet
    FOREIGN KEY (cod_judet) REFERENCES judet(id)
);

CREATE TABLE adresa (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  strada VARCHAR(150) NOT NULL,
  numar VARCHAR(20) NOT NULL,
  etaj INT,
  bloc VARCHAR(20),
  cod_postal CHAR(6),
  cod_localitate INT NOT NULL,

  CONSTRAINT fk_adresa_localitate
    FOREIGN KEY (cod_localitate) REFERENCES localitate(id)
);

CREATE TABLE departament (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL UNIQUE,
  descriere TEXT
);

CREATE TABLE utilizator (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL,
  prenume VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  parola_hash VARCHAR(255) NOT NULL,
  departament_id INT,
  functie VARCHAR(100),
  data_angajarii DATE,
  numar_telefon CHAR(10),
  id_adresa INT,
  este_activ BOOLEAN NOT NULL DEFAULT TRUE,
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_utilizator_departament
    FOREIGN KEY (departament_id) REFERENCES departament(id),

  CONSTRAINT fk_utilizator_adresa
    FOREIGN KEY (id_adresa) REFERENCES adresa(id)
);

CREATE TABLE cladire (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL,
  id_adresa INT NOT NULL,

  CONSTRAINT fk_cladire_adresa
    FOREIGN KEY (id_adresa) REFERENCES adresa(id)
);

CREATE TABLE sala (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume VARCHAR(100) NOT NULL,
  etaj INT NOT NULL,
  numar_locuri INT NOT NULL,
  id_cladire INT NOT NULL,
  harta_sala VARCHAR(255),

  CONSTRAINT fk_sala_cladire
    FOREIGN KEY (id_cladire) REFERENCES cladire(id),

  CONSTRAINT chk_sala_numar_locuri
    CHECK (numar_locuri > 0)
);

CREATE TABLE loc (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_sala INT NOT NULL,
  cod_loc VARCHAR(30) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'disponibil',
  tip_loc VARCHAR(50) NOT NULL DEFAULT 'standard',
  pozitie_x INT,
  pozitie_y INT,
  are_monitor BOOLEAN NOT NULL DEFAULT FALSE,
  are_docking_station BOOLEAN NOT NULL DEFAULT FALSE,

  CONSTRAINT fk_loc_sala
    FOREIGN KEY (id_sala) REFERENCES sala(id),

  CONSTRAINT chk_loc_status
    CHECK (status IN ('disponibil', 'ocupat', 'indisponibil')),

  CONSTRAINT chk_loc_tip
    CHECK (tip_loc IN ('standard', 'standing', 'reglabil'))
);

CREATE TABLE rezervare (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utilizator_id INT NOT NULL,
  loc_id INT NOT NULL,
  data_rezervare DATE NOT NULL,
  ora_start TIME NOT NULL,
  ora_final TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'confirmata',
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  anulata_la TIMESTAMP,

  CONSTRAINT fk_rezervare_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_rezervare_loc
    FOREIGN KEY (loc_id) REFERENCES loc(id),

  CONSTRAINT chk_rezervare_interval
    CHECK (ora_start < ora_final),

  CONSTRAINT chk_rezervare_status
    CHECK (status IN ('confirmata', 'anulata', 'finalizata')),

  CONSTRAINT uq_rezervare_loc_interval
    UNIQUE (loc_id, data_rezervare, ora_start, ora_final)
);

CREATE TABLE rezervare_recurenta (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utilizator_id INT NOT NULL,
  loc_id INT,
  data_start DATE NOT NULL,
  data_final DATE,
  ora_start TIME NOT NULL,
  ora_final TIME NOT NULL,
  frecventa VARCHAR(20) NOT NULL,
  zile_saptamana VARCHAR(100) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'activa',
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_rezervare_recurenta_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_rezervare_recurenta_loc
    FOREIGN KEY (loc_id) REFERENCES loc(id),

  CONSTRAINT chk_rezervare_recurenta_interval
    CHECK (ora_start < ora_final),

  CONSTRAINT chk_rezervare_recurenta_frecventa
    CHECK (frecventa IN ('zilnic', 'saptamanal')),

  CONSTRAINT chk_rezervare_recurenta_status
    CHECK (status IN ('activa', 'pauzata', 'anulata'))
);

CREATE TABLE coleg_favorit (
  utilizator_id INT NOT NULL,
  coleg_id INT NOT NULL,
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (utilizator_id, coleg_id),

  CONSTRAINT fk_coleg_favorit_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_coleg_favorit_coleg
    FOREIGN KEY (coleg_id) REFERENCES utilizator(id),

  CONSTRAINT chk_coleg_favorit_diferit
    CHECK (utilizator_id <> coleg_id)
);

CREATE TABLE preferinta_utilizator (
  utilizator_id INT PRIMARY KEY,
  etaj_preferat INT,
  tip_loc_preferat VARCHAR(50),
  ora_start_preferata TIME,
  ora_final_preferata TIME,
  primeste_alerte_plecare BOOLEAN NOT NULL DEFAULT TRUE,
  primeste_notificari_colegi BOOLEAN NOT NULL DEFAULT TRUE,

  CONSTRAINT fk_preferinta_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT chk_preferinta_interval
    CHECK (
      ora_start_preferata IS NULL
      OR ora_final_preferata IS NULL
      OR ora_start_preferata < ora_final_preferata
    )
);

CREATE TABLE invitatie_birou (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  expeditor_id INT NOT NULL,
  destinatar_id INT NOT NULL,
  rezervare_id INT,
  data_invitatie DATE NOT NULL,
  mesaj TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'trimisa',
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  raspuns_la TIMESTAMP,

  CONSTRAINT fk_invitatie_expeditor
    FOREIGN KEY (expeditor_id) REFERENCES utilizator(id),

  CONSTRAINT fk_invitatie_destinatar
    FOREIGN KEY (destinatar_id) REFERENCES utilizator(id),

  CONSTRAINT fk_invitatie_rezervare
    FOREIGN KEY (rezervare_id) REFERENCES rezervare(id),

  CONSTRAINT chk_invitatie_status
    CHECK (status IN ('trimisa', 'acceptata', 'respinsa', 'anulata')),

  CONSTRAINT chk_invitatie_utilizatori_diferiti
    CHECK (expeditor_id <> destinatar_id)
);

CREATE TABLE notificare (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  expeditor_id INT,
  destinatar_id INT NOT NULL,
  rezervare_id INT,
  tip VARCHAR(60) NOT NULL,
  titlu VARCHAR(150) NOT NULL,
  mesaj TEXT NOT NULL,
  citita_la TIMESTAMP,
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notificare_expeditor
    FOREIGN KEY (expeditor_id) REFERENCES utilizator(id),

  CONSTRAINT fk_notificare_destinatar
    FOREIGN KEY (destinatar_id) REFERENCES utilizator(id),

  CONSTRAINT fk_notificare_rezervare
    FOREIGN KEY (rezervare_id) REFERENCES rezervare(id),

  CONSTRAINT chk_notificare_tip
    CHECK (tip IN (
      'invitatie_birou',
      'coleg_favorit_rezervat',
      'sala_eliberata',
      'alerta_plecare',
      'rezervare_modificata',
      'rezervare_stearsa'
    ))
);

CREATE TABLE urmarire_sala (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utilizator_id INT NOT NULL,
  sala_id INT NOT NULL,
  data_dorita DATE NOT NULL,
  ora_start TIME NOT NULL,
  ora_final TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'activa',
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notificat_la TIMESTAMP,

  CONSTRAINT fk_urmarire_sala_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_urmarire_sala_sala
    FOREIGN KEY (sala_id) REFERENCES sala(id),

  CONSTRAINT chk_urmarire_sala_interval
    CHECK (ora_start < ora_final),

  CONSTRAINT chk_urmarire_sala_status
    CHECK (status IN ('activa', 'notificata', 'anulata', 'expirata'))
);

CREATE TABLE raport_vreme (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cladire_id INT NOT NULL,
  moment_raport TIMESTAMP NOT NULL,
  temperatura_celsius DECIMAL(5, 2),
  conditie VARCHAR(100),
  probabilitate_precipitatii INT,
  viteza_vant_kmh DECIMAL(6, 2),
  date_brute JSONB,

  CONSTRAINT fk_raport_vreme_cladire
    FOREIGN KEY (cladire_id) REFERENCES cladire(id),

  CONSTRAINT chk_raport_vreme_precipitatii
    CHECK (
      probabilitate_precipitatii IS NULL
      OR probabilitate_precipitatii BETWEEN 0 AND 100
    )
);

CREATE TABLE raport_trafic (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cladire_id INT NOT NULL,
  utilizator_id INT,
  moment_raport TIMESTAMP NOT NULL,
  punct_plecare VARCHAR(255),
  punct_destinatie VARCHAR(255),
  durata_estimata_minute INT NOT NULL,
  nivel_trafic VARCHAR(30) NOT NULL,
  date_brute JSONB,

  CONSTRAINT fk_raport_trafic_cladire
    FOREIGN KEY (cladire_id) REFERENCES cladire(id),

  CONSTRAINT fk_raport_trafic_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT chk_raport_trafic_durata
    CHECK (durata_estimata_minute > 0),

  CONSTRAINT chk_raport_trafic_nivel
    CHECK (nivel_trafic IN ('scazut', 'mediu', 'ridicat', 'sever'))
);

CREATE TABLE insight_ai (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utilizator_id INT NOT NULL,
  rezervare_id INT,
  raport_vreme_id INT,
  raport_trafic_id INT,
  text_insight TEXT NOT NULL,
  recomandare TEXT,
  model_ai VARCHAR(100),
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_insight_ai_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_insight_ai_rezervare
    FOREIGN KEY (rezervare_id) REFERENCES rezervare(id),

  CONSTRAINT fk_insight_ai_vreme
    FOREIGN KEY (raport_vreme_id) REFERENCES raport_vreme(id),

  CONSTRAINT fk_insight_ai_trafic
    FOREIGN KEY (raport_trafic_id) REFERENCES raport_trafic(id)
);

CREATE TABLE alerta_plecare (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utilizator_id INT NOT NULL,
  rezervare_id INT,
  raport_trafic_id INT,
  moment_alerta TIMESTAMP NOT NULL,
  ora_recomandata_plecare TIMESTAMP NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'programata',
  trimisa_la TIMESTAMP,
  creat_la TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_alerta_plecare_utilizator
    FOREIGN KEY (utilizator_id) REFERENCES utilizator(id),

  CONSTRAINT fk_alerta_plecare_rezervare
    FOREIGN KEY (rezervare_id) REFERENCES rezervare(id),

  CONSTRAINT fk_alerta_plecare_trafic
    FOREIGN KEY (raport_trafic_id) REFERENCES raport_trafic(id),

  CONSTRAINT chk_alerta_plecare_status
    CHECK (status IN ('programata', 'trimisa', 'anulata'))
);

CREATE INDEX idx_utilizator_email
  ON utilizator(email);

CREATE INDEX idx_loc_sala_status
  ON loc(id_sala, status);

CREATE INDEX idx_rezervare_data
  ON rezervare(data_rezervare);

CREATE INDEX idx_rezervare_utilizator_data
  ON rezervare(utilizator_id, data_rezervare);

CREATE INDEX idx_rezervare_loc_data
  ON rezervare(loc_id, data_rezervare);

CREATE INDEX idx_notificare_destinatar
  ON notificare(destinatar_id, citita_la);

CREATE INDEX idx_raport_vreme_cladire_moment
  ON raport_vreme(cladire_id, moment_raport);

CREATE INDEX idx_raport_trafic_cladire_moment
  ON raport_trafic(cladire_id, moment_raport);
