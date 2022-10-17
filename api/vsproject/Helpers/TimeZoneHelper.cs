using System;

namespace SalviaServiceAPI.Helpers
{
    public static class TimeZoneHelper
    {
        public static TimeZoneInfo GetOperatingSystemBasedHelsinkiTimeZoneInfo()
        {
            if (OperatingSystem.IsWindows())
            {
                return TimeZoneInfo.FindSystemTimeZoneById("FLE Standard Time");
            }
            else if (OperatingSystem.IsLinux())
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Europe/Helsinki");
            }
            else if (OperatingSystem.IsIOS())
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Europe/Helsinki");
            }
            else return null;
        }

        public static DateTime UtcToFinnishTimeNoNull(DateTime utcTime)
        {
            var timeZoneFinland = TimeZoneHelper.GetOperatingSystemBasedHelsinkiTimeZoneInfo();
            var datetime = TimeZoneInfo.ConvertTimeFromUtc((DateTime)utcTime, timeZoneFinland);
            return datetime;
        }

        public static DateTime FinnishTimeToUtcNoNull(DateTime finnishTime)
        {
            var timeZoneFinland = TimeZoneHelper.GetOperatingSystemBasedHelsinkiTimeZoneInfo();
            var datetime = TimeZoneInfo.ConvertTimeToUtc((DateTime)finnishTime, timeZoneFinland);
            return datetime;
        }

        public static DateTime? UtcToFinnishTime(DateTime? utcTime)
        {
            if (utcTime != null)
            {
                var timeZoneFinland = TimeZoneHelper.GetOperatingSystemBasedHelsinkiTimeZoneInfo();
                var datetime = TimeZoneInfo.ConvertTimeFromUtc((DateTime)utcTime, timeZoneFinland);
                return datetime;
            }
            else return null;
        }

        public static DateTime? FinnishTimeToUtc(DateTime? finnishTime)
        {
            if (finnishTime != null)
            {
                var timeZoneFinland = TimeZoneHelper.GetOperatingSystemBasedHelsinkiTimeZoneInfo();
                var datetime = TimeZoneInfo.ConvertTimeToUtc((DateTime)finnishTime, timeZoneFinland);
                return datetime;
            }
            else return null;
        }
    }
}




