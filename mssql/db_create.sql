CREATE DATABASE salvialocaldb01;
GO
USE salvialocaldb01;
GO

/****** START This is just for premilinary testing of csv importing ******/
CREATE TABLE Products (ID int, ProductName nvarchar(max));
GO
/****** END This is just for premilinary testing of csv importing ******/

/****** Object:  Table [dbo].[TestCase]    Script Date: 22/06/2021 13.01.07 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TestCase](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[URL] [nvarchar](2048) NOT NULL,
	[CreationTime] [datetime] NOT NULL,
 CONSTRAINT [PK_TestCase] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[TestRun]    Script Date: 22/06/2021 13.02.22 ******/

CREATE TABLE [dbo].[TestRun](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestCaseId] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
    [Viewport] [varchar](10) NULL,
    [Report] [varchar](100) NULL,
 CONSTRAINT [PK_TestRun] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TestRun]  WITH CHECK ADD  CONSTRAINT [FK_TestRun_TestCase] FOREIGN KEY([TestCaseId])
REFERENCES [dbo].[TestCase] ([Id])
GO

ALTER TABLE [dbo].[TestRun] CHECK CONSTRAINT [FK_TestRun_TestCase]
GO

CREATE TABLE [dbo].[TestResult](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestRunId] [int] NOT NULL,
	[Description] [nvarchar](2048) NOT NULL,
	[Passed] [int] NOT NULL,
	[Warning] [int] NOT NULL,
	[Failed] [int] NOT NULL,
	[Inapplicable] [int] NOT NULL,
	[CreationTime] [datetime] NOT NULL,
 CONSTRAINT [PK_TestResult] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[TestResult]  WITH CHECK ADD  CONSTRAINT [FK_TestResult_TestRun] FOREIGN KEY([TestRunId])
REFERENCES [dbo].[TestRun] ([Id])
GO

ALTER TABLE [dbo].[TestResult] CHECK CONSTRAINT [FK_TestResult_TestRun]
GO

CREATE TABLE [dbo].[TestRunJson](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestRunId] [int] NOT NULL,
	[Data] [nvarchar](max) NOT NULL,
	[CreationTime] [datetime] NOT NULL
 CONSTRAINT [PK_TestRunJson] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[TestRunJson]  WITH CHECK ADD  CONSTRAINT [FK_TestRunJson_TestRun] FOREIGN KEY([TestRunId])
REFERENCES [dbo].[TestRun] ([Id])
GO

ALTER TABLE [dbo].[TestRunJson] CHECK CONSTRAINT [FK_TestRunJson_TestRun]
GO

CREATE TABLE [dbo].[TestResultJson](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TestResultId] [int] NOT NULL,
	[Data] [nvarchar](max) NOT NULL,
	[CreationTime] [datetime] NOT NULL
 CONSTRAINT [PK_TestResultJson] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[TestResultJson]  WITH CHECK ADD CONSTRAINT [FK_TestResultJson_TestResult] FOREIGN KEY([TestResultId])
REFERENCES [dbo].[TestResult] ([Id])
GO

ALTER TABLE [dbo].[TestResultJson] CHECK CONSTRAINT [FK_TestResultJson_TestResult]
GO

